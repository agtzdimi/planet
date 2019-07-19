'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const shell = require('shelljs');
const {
  mongoUser,
  mongoPass,
  mongoIP,
  mongoPort,
  mongoAuthDb } = require('./bin/www');
const app = express();
const session = require('express-session');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(
  session({
    secret: 'dog vs cat',
    resave: true,
    saveUninitialized: false,
  })
);
const authApi = require('./routes/authAPI');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})
  .options('*', function (req, res, next) {
    res.end();
  });
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/public', express.static('`${__dirname}/../public/files'));

app.post('/planet/rest/upload', (req, res, next) => {
  shell.echo(req.body.param1).to(`${__dirname}/../public/files/Parameters_initialization.txt`);
  shell.echo(req.body.param2).to(`${__dirname}/../public/files/Control_initialization.txt`);
  shell.echo(req.body.param3).to(`${__dirname}/../public/files/Economy_environment_initialization.txt`);
  res.json({
    file: '$(req.files.file)',
  });
});

app.post('/planet/rest/save_data', (req, res, next) => {
  const formName = JSON.parse(shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " planet --quiet --eval 'db.files.distinct(\"formName\");'"));
  const inputFormName = JSON.parse(req.body.pvPayload);
  inputFormName.payload.formName = inputFormName.payload.formName.replace(/^\s/, '');
  inputFormName.payload.formName = inputFormName.payload.formName.replace(/\s$/, '');
  console.log(req.body.pvPayload + '################################################');
  if (formName.includes(inputFormName.payload.formName)) {
    if (req.body.method === 'LOAD') {
      shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
        ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
        " planet --eval \"db.files.remove({'payload.formName': '" + inputFormName.payload.formName + "'})\"");
      shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
        ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
        " planet --eval \"db.files.remove({'formName': '" + inputFormName.payload.formName + "'})\"");
      shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
        ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
        " planet --eval \"db.results.remove({'formName': '" + inputFormName.payload.formName + "'})\"");
      shell.exec(`${__dirname}/pythonScripts/generateData.sh '` + req.body.windPayload + "' '" + req.body.pvPayload + "'",
        function (code, stdout, stderr) {
          if (code === 1) {
            return res.send('Error: Not all data are loaded to the DB!');
          } else {
            return res.send('Data successfully saved to Database!');
          }
        });
    } else {
      return res.send('Error: Simulation Name Already Exists!');
    }
  } else {
    shell.exec(`${__dirname}/pythonScripts/generateData.sh '` + req.body.windPayload + "' '" + req.body.pvPayload + "'",
      function (code, stdout, stderr) {
        if (code === 1) {
          return res.send('Error: Not all data are loaded to the DB!');
        } else {
          return res.send('Data successfully saved to Database!');
        }
      });
  }

});

app.get('/planet/rest/get_form_names', (req, res) => {
  let collection = '';
  if (req.query.executed === 'true') {
    collection = 'results';
  } else {
    collection = 'files';
  }
  const formName = JSON.parse(shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " --quiet planet --eval 'db." + collection + ".distinct(\"formName\");'"));
  const formDescr = JSON.parse(shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " --quiet planet --eval 'db.files.distinct(\"payload.formDescription\");'"));
  res.send({ formName: formName, formDescription: formDescr });
});

app.post('/planet/rest/transfer', (req, res) => {
  shell.exec(`${__dirname}/pythonScripts/simulate.sh ` + '"' + req.body.formName + '" ' + req.body.mode);
  return res.send({
    status: 'Transfer Completed',
  });
});

app.get('/planet/rest/load_data', (req, res) => {
  shell.exec(`${__dirname}/pythonScripts/load_data.sh ` + '"' + req.query.formName + '"');
  const paramInitParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/Parameters_initialization.txt`);
  const econEnvParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/Economy_environment_initialization.txt`);
  const controlParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/Control_initialization.txt`);
  const windParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/WindData.txt`);
  const pvParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/PVData.txt`);
  shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/loadData/Electricity.csv`);
  shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/loadData/Heat.csv`);
  const elecParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/Electricity.csv`);
  const heatParam = shell.exec('cat ' + `${__dirname}/../public/files/loadData/Heat.csv`);
  const Parameters = {
    paramInit: paramInitParam.stdout,
    econEnv: econEnvParam.stdout,
    controlSystem: controlParam.stdout,
    elecParam: elecParam.stdout,
    heatParam: heatParam.stdout,
    windParam: windParam.stdout,
    pvParam: pvParam.stdout,
  };
  res.send(Parameters);
  shell.exec('rm -rf ' + `${__dirname}/../public/files/loadData`);
});

app.get('/planet/rest/simulation', (req, res) => {
  shell.exec(`${__dirname}/pythonScripts/save_results.sh ` + "'Results1' " + '"' + req.query.formName + '"');
  shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/Results1.csv`);
  const results1 = shell.exec('cat ' + `${__dirname}/../public/files/Results1.csv`);
  shell.exec(`${__dirname}/pythonScripts/save_results.sh ` + "'Results2' " + '"' + req.query.formName + '"');
  shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/Results2.csv`);
  const results2 = shell.exec('cat ' + `${__dirname}/../public/files/Results2.csv`);
  const status = shell.exec('cat ' + `${__dirname}/../public/files/simulationStatus.txt`);
  const finalResults = {
    results1: results1.stdout,
    results2: results2.stdout,
    status: status.stdout,
  };
  res.send(finalResults);
  if (results1.stderr === '' && results2.stderr === '') {
    shell.exec('rm -rf ' + `${__dirname}/../public/files/*`);
  }
});

app.get('/planet/rest/multi_simulation', (req, res) => {
  try {
    let results1;
    let results2;
    let finalResults = {};
    for (let i = 0; i < Object.keys(req.query).length; i++) {
      const formName = 'formName' + (i + 1);
      shell.exec(`${__dirname}/pythonScripts/save_results.sh ` + "'multi'" + (i + 1) + "'Results1' " + '"' + req.query[formName] + '"');
      shell.exec(`${__dirname}/pythonScripts/save_results.sh ` + "'Results2' " + '"' + req.query[formName] + '"');
      shell.exec(`mv ${__dirname}/../public/files/Results2.csv ${__dirname}/../public/files/` + "'multi'" + (i + 1) + "'Results2.csv'");
      shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/multi` + (i + 1) + 'Results1.csv');
      shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../public/files/multi` + (i + 1) + 'Results2.csv');
      results1 = shell.exec('cat ' + `${__dirname}/../public/files/multi` + (i + 1) + 'Results1.csv');
      results2 = shell.exec('cat ' + `${__dirname}/../public/files/multi` + (i + 1) + 'Results2.csv');
      const finalResultsString = 'results' + (i + 1);
      finalResults[finalResultsString] = {
        results1: results1.stdout,
        results2: results2.stdout,
      };
    }
    res.send(finalResults);
    if (results1.stderr === '' && results2.stderr === '') {
      shell.exec('rm -rf ' + `${__dirname}/../public/files/*`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/planet/rest/simulation_status', (req, res) => {
  const results = shell.exec('cat ' + `${__dirname}/../public/files/barStatus.txt`);
  const finalResults = {
    value: results.stdout,
  };
  res.send(finalResults);
});

app.post('/planet/rest/update_IPs', (req, res) => {
  const update = shell.exec(`${__dirname}/pythonScripts/updateParams.sh ` + req.body.planet + ' ' + req.body.sitewhere + ' ' +
    req.body.planetRESTPort + ' ' + req.body.sitewhereUIPort + ' ' + req.body.sitewhereMQTTPort + ' ' +
    req.body.mongoIP + ' ' + req.body.mongoPort + ' ' + req.body.mongoUser + ' ' + req.body.mongoPassword + ' ' +
    req.body.mongoAuthDB + ' ' + req.body.simulationMachine + ' ' + req.body.planetUIPort + ' ' + req.body.simulationMachineTopic +
    ' ' + req.body.simulationMachinePort);
  if (!update.stderr) {
    const dotenv = require('dotenv');
    dotenv.config();
    res.send({ text: 'Parameters successfully updated!' });
  } else {
    res.send({ text: 'Error: Parameters were not updated!' });
  }
});

app.post('/planet/rest/delete_scenario', (req, res, next) => {
  const formName = req.body.formName;
  let status = [];
  let msg = 'Scenario deleted successfully';
  status[0] = shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " planet --eval \"db.files.remove({'payload.formName': '" + formName + "'})\"");
  status[1] = shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " planet --eval \"db.files.remove({'formName': '" + formName + "'})\"");
  status[2] = shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
    ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
    " planet --eval \"db.results.remove({'formName': '" + formName + "'})\"");
  for (let i = 0; i < 3; i++) {
    if (status[i].stderr) {
      msg = status[i].stderr;
    }
  }
  res.send(msg);
});

app.post('/planet/rest/add_device', (req, res, next) => {
  let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../linksmart/conf/devices/mqtt-switch.json`).stdout);
  results['resources'].push(req.body);
  shell.exec('mosquitto_pub -t "middleware_restart" -m "Start"');
  const status = shell.exec("mosquitto_pub -t \"middleware_restart\" -m \'" + JSON.stringify(results) + "\'");
  shell.exec('mosquitto_pub -t "middleware_restart" -m "End"');
  if (!status.stderr) {
    res.send({ response: 'Success' });
  }
});

app.get('/planet/rest/get_devices', (req, res, next) => {
  const results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../linksmart/conf/devices/mqtt-switch.json`).stdout);
  res.send({ results: results });
});

app.post('/planet/rest/edit_device', (req, res, next) => {
  let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../linksmart/conf/devices/mqtt-switch.json`).stdout);
  results['resources'] = results['resources'].map((val) => {
    if (val['name'] === req.body[0].name) {
      val['description'] = req.body[0].description;
      val['IP'] = req.body[0].IP;
      val['Port'] = req.body[0].Port;
      val['metadata'] = req.body[0].metadata;
      return val;
    } else {
      return val;
    }
  });

  shell.exec('mosquitto_pub -t "middleware_restart" -m "Start"');
  const status = shell.exec("mosquitto_pub -t \"middleware_restart\" -m \'" + JSON.stringify(results) + "\'");
  shell.exec('mosquitto_pub -t "middleware_restart" -m "End"');
  if (!status.stderr) {
    res.send({ response: 'Success' });
  }
});

app.post('/planet/rest/delete_device', (req, res, next) => {
  let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../linksmart/conf/devices/mqtt-switch.json`).stdout);
  results['resources'] = results['resources'].filter((val) => {
    if (val['name'] !== req.body.name) {
      return val;
    }
  });

  shell.exec('mosquitto_pub -t "middleware_restart" -m "Start"');
  const status = shell.exec("mosquitto_pub -t \"middleware_restart\" -m \'" + JSON.stringify(results) + "\'");
  shell.exec('mosquitto_pub -t "middleware_restart" -m "End"');
  if (!status.stderr) {
    res.send({ response: 'Success' });
  }
});

app.post('/planet/rest/create_user', authApi.create_user);
app.post('/planet/rest/update_user', authApi.update_user);
app.post('/planet/rest/login_with_email_password', authApi.login_with_email_password);
app.post('/planet/rest/login_with_token', authApi.login_with_token);
app.post('/planet/rest/logout', authApi.logout);
app.post('/planet/rest/get_user_list', authApi.get_user_list);
app.post('/planet/rest/remove_user', authApi.remove_user);
app.post('/planet/rest/forgot', authApi.forgot);
app.post('/planet/rest/reset', authApi.reset);
app.post('/planet/rest/refresh', authApi.refresh);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
