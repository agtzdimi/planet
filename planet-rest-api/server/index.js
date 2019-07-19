'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

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
const planetApi = require('./routes/planetAPI');

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

/* PLANET API */
app.post('/planet/rest/upload', planetApi.upload);
app.post('/planet/rest/save_data', planetApi.saveData);
app.get('/planet/rest/get_form_names', planetApi.getFormNames);
app.post('/planet/rest/transfer', planetApi.transfer);
app.get('/planet/rest/load_data', planetApi.loadData);
app.get('/planet/rest/simulation', planetApi.simulation);
app.get('/planet/rest/multi_simulation', planetApi.multiSimulation);
app.get('/planet/rest/simulation_status', planetApi.simulationStatus);
app.post('/planet/rest/update_IPs', planetApi.updateIPs);
app.post('/planet/rest/delete_scenario', planetApi.deleteScenario);
app.post('/planet/rest/add_device', planetApi.addDevice);
app.get('/planet/rest/get_devices', planetApi.getDevices);
app.post('/planet/rest/edit_device', planetApi.editDevice);
app.post('/planet/rest/delete_device', planetApi.deleteDevice);

/* AUTH API */

app.post('/planet/rest/create_user', authApi.create_user);
app.post('/planet/rest/update_user', authApi.update_user);
app.post('/planet/rest/login_with_email_password', authApi.login_with_email_password);
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
