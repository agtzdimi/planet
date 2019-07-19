'use strict';
const express = require('express');
const shell = require('shelljs');
const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
    mongoAuthDb } = require('../bin/www');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload({}));

exports.upload = (req, res) => {
    shell.echo(req.body.param1).to(`${__dirname}/../../public/files/Parameters_initialization.txt`);
    shell.echo(req.body.param2).to(`${__dirname}/../../public/files/Control_initialization.txt`);
    shell.echo(req.body.param3).to(`${__dirname}/../../public/files/Economy_environment_initialization.txt`);
    res.json({
        file: '$(req.files.file)',
    });
};

exports.saveData = (req, res) => {
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
            shell.exec(`${__dirname}/../pythonScripts/generateData.sh '` + req.body.windPayload + "' '" + req.body.pvPayload + "'",
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
        shell.exec(`${__dirname}/../pythonScripts/generateData.sh '` + req.body.windPayload + "' '" + req.body.pvPayload + "'",
            function (code) {
                if (code === 1) {
                    return res.send('Error: Not all data are loaded to the DB!');
                } else {
                    return res.send('Data successfully saved to Database!');
                }
            });
    }

};

exports.getFormNames = (req, res) => {
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
};

exports.transfer = (req, res) => {
    shell.exec(`${__dirname}/../pythonScripts/simulate.sh ` + '"' + req.body.formName + '" ' + req.body.mode);
    return res.send({
        status: 'Transfer Completed',
    });
};

exports.loadData = (req, res) => {
    shell.exec(`${__dirname}/../pythonScripts/load_data.sh ` + '"' + req.query.formName + '"');
    const paramInitParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/Parameters_initialization.txt`);
    const econEnvParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/Economy_environment_initialization.txt`);
    const controlParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/Control_initialization.txt`);
    const windParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/WindData.txt`);
    const pvParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/PVData.txt`);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/loadData/Electricity.csv`);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/loadData/Heat.csv`);
    const elecParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/Electricity.csv`);
    const heatParam = shell.exec('cat ' + `${__dirname}/../../public/files/loadData/Heat.csv`);
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
    shell.exec('rm -rf ' + `${__dirname}/../../public/files/loadData`);
};

exports.simulation = (req, res) => {
    shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results1' " + '"' + req.query.formName + '"');
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/Results1.csv`);
    const results1 = shell.exec('cat ' + `${__dirname}/../../public/files/Results1.csv`);
    shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results2' " + '"' + req.query.formName + '"');
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/Results2.csv`);
    const results2 = shell.exec('cat ' + `${__dirname}/../../public/files/Results2.csv`);
    const status = shell.exec('cat ' + `${__dirname}/../../public/files/simulationStatus.txt`);
    const finalResults = {
        results1: results1.stdout,
        results2: results2.stdout,
        status: status.stdout,
    };
    res.send(finalResults);
    if (results1.stderr === '' && results2.stderr === '') {
        shell.exec('rm -rf ' + `${__dirname}/../../public/files/*`);
    }
};

exports.multiSimulation = (req, res) => {
    try {
        let results1;
        let results2;
        let finalResults = {};
        for (let i = 0; i < Object.keys(req.query).length; i++) {
            const formName = 'formName' + (i + 1);
            shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'multi'" + (i + 1) + "'Results1' " + '"' + req.query[formName] + '"');
            shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results2' " + '"' + req.query[formName] + '"');
            shell.exec(`mv ${__dirname}/../../public/files/Results2.csv ${__dirname}/../../public/files/` + "'multi'" + (i + 1) + "'Results2.csv'");
            shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/multi` + (i + 1) + 'Results1.csv');
            shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/multi` + (i + 1) + 'Results2.csv');
            results1 = shell.exec('cat ' + `${__dirname}/../../public/files/multi` + (i + 1) + 'Results1.csv');
            results2 = shell.exec('cat ' + `${__dirname}/../../public/files/multi` + (i + 1) + 'Results2.csv');
            const finalResultsString = 'results' + (i + 1);
            finalResults[finalResultsString] = {
                results1: results1.stdout,
                results2: results2.stdout,
            };
        }
        res.send(finalResults);
        if (results1.stderr === '' && results2.stderr === '') {
            shell.exec('rm -rf ' + `${__dirname}/../../public/files/*`);
        }
    } catch (error) {
        console.log(error);
    }
};

exports.simulationStatus = (req, res) => {
    const results = shell.exec('cat ' + `${__dirname}/../../public/files/barStatus.txt`);
    const finalResults = {
        value: results.stdout,
    };
    res.send(finalResults);
};

exports.updateIPs = (req, res) => {
    const update = shell.exec(`${__dirname}/../pythonScripts/updateParams.sh ` + req.body.planet + ' ' + req.body.sitewhere + ' ' +
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
};

exports.deleteScenario = (req, res) => {
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
};

exports.addDevice = (req, res) => {
    let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../../linksmart/conf/devices/mqtt-switch.json`).stdout);
    results['resources'].push(req.body);
    shell.exec('mosquitto_pub -t "middleware_restart" -m "Start"');
    const status = shell.exec("mosquitto_pub -t \"middleware_restart\" -m \'" + JSON.stringify(results) + "\'");
    shell.exec('mosquitto_pub -t "middleware_restart" -m "End"');
    if (!status.stderr) {
        res.send({ response: 'Success' });
    }
};

exports.getDevices = (req, res) => {
    const results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../../linksmart/conf/devices/mqtt-switch.json`).stdout);
    res.send({ results: results });
};

exports.editDevice = (req, res) => {
    let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../../linksmart/conf/devices/mqtt-switch.json`).stdout);
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
};

exports.deleteDevice = (req, res) => {
    let results = JSON.parse(shell.exec('cat ' + `${__dirname}/../../../linksmart/conf/devices/mqtt-switch.json`).stdout);
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
};
