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
    const timeStamp = Date.now();
    shell.exec('mkdir ' + `${__dirname}/../../public/files/` + req.body.email + "_" + timeStamp);
    shell.echo(req.body.param1).to(`${__dirname}/../../public/files/` +
        req.body.email + "_" + timeStamp + `/Parameters_initialization.txt`);
    res.json({
        file: '$(req.files.file)',
        timeStamp: timeStamp,
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
            shell.exec(`${__dirname}/../pythonScripts/generateData.sh '` + req.body.windPayload + "' '" +
                req.body.pvPayload + "' true " + req.body.email + "_" + req.body.timeStamp,
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
        shell.exec(`${__dirname}/../pythonScripts/generateData.sh '` + req.body.windPayload + "' '" +
            req.body.pvPayload + "' true " + req.body.email + "_" + req.body.timeStamp,
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
    try {
        let collection = '';
        if (req.query.executed === 'true') {
            collection = 'results';
        } else {
            collection = 'files';
        }
        const formDescr = [];
        const owner = [];
        const eventDates = [];
        const simulated = [];
        const formName = JSON.parse(shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
            ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
            " --quiet planet --eval 'db." + collection + ".distinct(\"formName\");'", { silent: true }).stdout);
        for (let form = 0; form < formName.length; form++) {
            let formJson = shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
                ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
                " --quiet planet --eval 'db.files.find({\"payload.formName\": \"" + formName[form] + "\", \"payload.model\" : {$gt: 0}});'", { silent: true }).stdout;
            formJson = formJson.replace("ObjectId(", "");
            formJson = formJson.replace("\")", "\"");
            formJson = JSON.parse(formJson);
            const sim = shell.exec('mongo -u ' + mongoUser + ' -p ' + mongoPass + ' --port ' + mongoPort +
                ' --host ' + mongoIP + ' --authenticationDatabase ' + mongoAuthDb +
                " --quiet planet --eval 'db.results.find({\"formName\": \"" + formName[form] + "\"});'", { silent: true }).stdout;
            if (sim.length !== 0) {
                simulated.push(true);
            } else {
                simulated.push(false);
            }
            formDescr.push(formJson.payload.formDescription);
            eventDates.push(formJson.payload.eventDate);
            owner.push(formJson.payload.owner);
        }
        res.send({
            formName: formName,
            formDescription: formDescr,
            owner: owner,
            eventDate: eventDates,
            simulated: simulated,
        });
    }
    catch (e) {
        console.log(e)
    }
};

exports.transfer = (req, res) => {
    const timeStamp = Date.now();
    shell.exec(`${__dirname}/../pythonScripts/simulate.sh ` + '"' + req.body.formName + '" ' +
        req.body.mode + " " + req.body.email + "_" + timeStamp);
    return res.send({
        status: 'Transfer Completed',
        timeStamp: timeStamp,
    });
};

exports.loadData = (req, res) => {
    const timeStamp = Date.now();
    const email = req.query.email + "_" + timeStamp;
    console.log(`${__dirname}/../pythonScripts/load_data.sh ` + `"` + req.query.formName + `" "` + email + `"`)
    shell.exec(`${__dirname}/../pythonScripts/load_data.sh ` + `"` + req.query.formName + `" "` + email + `"`);
    const paramInitParam = shell.exec('cat ' + `${__dirname}/../../public/files/` +
        email + `/loadData/Parameters_initialization.txt`);
    const windParam = shell.exec('cat ' + `${__dirname}/../../public/files/` +
        email + `/loadData/WindData.txt`);
    const pvParam = shell.exec('cat ' + `${__dirname}/../../public/files/` +
        email + `/loadData/PVData.txt`);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` +
        email + `/loadData/Electricity.csv`);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` +
        email + `/loadData/Heat.csv`);
    const elecParam = shell.exec('cat ' + `${__dirname}/../../public/files/` +
        email + `/loadData/Electricity.csv`);
    const heatParam = shell.exec('cat ' + `${__dirname}/../../public/files/` +
        email + `/loadData/Heat.csv`);
    const parameters = {
        paramInit: paramInitParam.stdout,
        econEnv: econEnvParam.stdout,
        controlSystem: controlParam.stdout,
        elecParam: elecParam.stdout,
        heatParam: heatParam.stdout,
        windParam: windParam.stdout,
        pvParam: pvParam.stdout,
    };
    res.send(parameters);
    shell.exec('rm -rf ' + `${__dirname}/../../public/files/` + email);
};

exports.simulation = (req, res) => {
    const email = req.query.email;
    shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results1' " + '"' +
        req.query.formName + '" ' + email);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` + email + `/Results1.csv`);
    const results1 = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/Results1.csv`);
    shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results2' " + '"' +
        req.query.formName + '" ' + email);
    shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` + email + `/Results2.csv`);
    const results2 = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/Results2.csv`);
    const status = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/simulationStatus.txt`);
    const finalResults = {
        results1: results1.stdout,
        results2: results2.stdout,
        status: status.stdout,
    };
    res.send(finalResults);
    if (results1.stderr === '' && results2.stderr === '') {
        shell.exec('rm -rf ' + `${__dirname}/../../public/files/` + email);
    }
};

exports.multiSimulation = (req, res) => {
    try {
        let results1;
        let results2;
        let finalResults = {};
        const email = req.query['email'];
        for (let i = 0; i < Object.keys(req.query).length; i++) {
            const formName = 'formName' + (i + 1);
            shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'multi'" + (i + 1) +
                "'Results1' " + '"' + req.query[formName] + '" ' + email);
            shell.exec(`${__dirname}/../pythonScripts/save_results.sh ` + "'Results2' " + '"' +
                req.query[formName] + '" ' + email);
            shell.exec(`mv ${__dirname}/../../public/files/` + email + `/Results2.csv ${__dirname}/../../public/files/` +
                email + `/` + "'multi'" + (i + 1) + "'Results2.csv'");
            shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` + email + `/multi` + (i + 1) + 'Results1.csv');
            shell.exec("sed -i '/^,,.*/d' " + `${__dirname}/../../public/files/` + email + `/multi` + (i + 1) + 'Results2.csv');
            results1 = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/multi` + (i + 1) + 'Results1.csv');
            results2 = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/multi` + (i + 1) + 'Results2.csv');
            const finalResultsString = 'results' + (i + 1);
            finalResults[finalResultsString] = {
                results1: results1.stdout,
                results2: results2.stdout,
            };
        }
        res.send(finalResults);
        shell.exec('rm -rf ' + `${__dirname}/../../public/files/` + email);
    } catch (error) {
        console.log(error);
    }
};

exports.simulationStatus = (req, res) => {
    const results = shell.exec('cat ' + `${__dirname}/../../public/files/` + req.body.email + `/barStatus.txt`);
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

exports.get_profiles = (req, res) => {
    const windPayload = req.query.windPayload;
    const pvPayload = req.query.pvPayload;
    const timeStamp = Date.now();
    const email = req.query.email + "_" + timeStamp;
    shell.exec(`${__dirname}/../pythonScripts/generateData.sh '` + windPayload + "' '" + pvPayload + "' false '" +
        req.query.nodes + "' '" + req.query.timeStep + "' " + email,
        function (code) {
            if (code === 1) {
                return res.send('Error: Not all data are loaded to the DB!');
            } else {
                const pv = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/PV.csv`).stdout;
                const wind = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/Wind.csv`).stdout;
                const elec = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/Electricity.csv`).stdout;
                const heat = shell.exec('cat ' + `${__dirname}/../../public/files/` + email + `/Heat.csv`).stdout;
                res.send({
                    'electricity': elec,
                    'heat': heat,
                    'pv': pv,
                    'wind': wind,
                });
                shell.exec('rm -rf ' + `${__dirname}/../../public/files/` + email);
            }
        });
};
