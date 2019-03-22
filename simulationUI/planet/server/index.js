const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const shell = require("shelljs");
const app = express();
var fs = require('fs');
const session = require("express-session");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(
    session({
        secret: "dog vs cat",
        resave: true,
        saveUninitialized: false
    })
);
const api = require("./routes/api");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type,Authorization"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    })
    .options("*", function (req, res, next) {
        res.end();
    });
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cookieParser());

app.use(fileUpload({}));

app.use("/public", express.static(__dirname + "../public"));

app.post("/upload", (req, res, next) => {
    shell.echo(req.body.param1).to(`${__dirname}/../public/files/Parameters_initialization.txt`);
    shell.echo(req.body.param2).to(`${__dirname}/../public/files/Control_initialization.txt`);
    shell.echo(req.body.param3).to(`${__dirname}/../public/files/Economy_environment_initialization.txt`);
    res.json({
        file: `$(req.files.file)`
    });
    if ((req.body.method === 'LOAD' || req.body.method === 'NEW') && req.files) {
        console.log("Start File uploading...")
        for (const fil of Object.keys(req.files.file)) {
            let uploadFile = req.files.file[fil];
            const fileName = req.files.file[fil].name;
            uploadFile.mv(`/home/planet/upload/${fileName}`, function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err);
                }
            });
        }
    }
    else {
        console.log("Generate Timeseries...")
        shell.exec("echo -e " + req.body.param4).to("/home/planet/upload/Electricity.csv");
        shell.exec("sed -i '$ d' /home/planet/upload/Electricity.csv");
        shell.exec("echo -e " + req.body.param5).to("/home/planet/upload/Heat.csv");
        shell.exec("sed -i '$ d' /home/planet/upload/Heat.csv");
    }
});

app.post("/save_data", (req, res, next) => {
    formName = JSON.parse(shell.exec("mongo --port 21569 planet --quiet --eval 'db.files.distinct(\"formName\");'"));
    inputFormName = JSON.parse(req.body.pvPayload)
    inputFormName.payload.formName = inputFormName.payload.formName.replace(/^\s/, '');
    inputFormName.payload.formName = inputFormName.payload.formName.replace(/\s$/, '');
    if (formName.includes(inputFormName.payload.formName)) {
        if (req.body.method === 'LOAD') {
            shell.exec("mongo --port 21569 planet --eval \"db.files.remove({'payload.formName': '" + inputFormName.payload.formName + "'})\"");
            shell.exec("mongo --port 21569 planet --eval \"db.files.remove({'formName': '" + inputFormName.payload.formName + "'})\"");
            shell.exec("mongo --port 21569 planet --eval \"db.results.remove({'formName': '" + inputFormName.payload.formName + "'})\"");
            shell.exec("/home/planet/generateData.sh '" + req.body.windPayload + "' '" + req.body.pvPayload + "'", function (code, stdout, stderr) {
                if (code === 1) {
                    return res.send("Error: Not all data are loaded to the DB!");
                } else {
                    return res.send("Successfully Loaded Data");
                }
            });
        } else {
            return res.send("Error: Simulation Name Already Exists!");
        }
    }
    else {
        shell.exec("/home/planet/generateData.sh '" + req.body.windPayload + "' '" + req.body.pvPayload + "'", function (code, stdout, stderr) {
            if (code === 1) {
                return res.send("Error: Not all data are loaded to the DB!");
            } else {
                return res.send("Successfully Loaded Data");
            }
        });
    }

});

app.get("/get_form_names", (req, res) => {
    let collection = ""
    if (req.query.executed === "true") {
        collection = "results"
    } else {
        collection = "files"
    }
    formName = JSON.parse(shell.exec("mongo --port 21569 --quiet planet --eval 'db." + collection + ".distinct(\"formName\");'"));
    formDescr = JSON.parse(shell.exec("mongo --port 21569 --quiet planet --eval 'db.files.distinct(\"payload.formDescription\");'"));
    res.send({ "formName": formName, "formDescription": formDescr });
});

app.post("/transfer", (req, res) => {
    shell.exec("/home/planet/simulate.sh " + "\"" + req.body.formName + "\"");
    return res.send("Transfer Completed");
});

app.get("/load_data", (req, res) => {
    shell.exec("/home/planet/load_data.sh " + "\"" + req.query.formName + "\"");
    paramInitParam = shell.exec("cat /home/planet/upload/loadData/Parameters_initialization.txt");
    econEnvParam = shell.exec("cat /home/planet/upload/loadData/Economy_environment_initialization.txt");
    controlParam = shell.exec("cat /home/planet/upload/loadData/Control_initialization.txt");
    date = shell.exec("cat /home/planet/upload/loadData/WindData.txt")
    shell.exec("sed -i '/^,,.*/d' /home/planet/upload/loadData/Electricity.csv");
    shell.exec("sed -i '/^,,.*/d' /home/planet/upload/loadData/Heat.csv");
    elecParam = shell.exec("cat /home/planet/upload/loadData/Electricity.csv");
    heatParam = shell.exec("cat /home/planet/upload/loadData/Heat.csv");
    Parameters = {
        "paramInit": paramInitParam.stdout,
        "econEnv": econEnvParam.stdout,
        "controlSystem": controlParam.stdout,
        "elecParam": elecParam.stdout,
        "heatParam": heatParam.stdout,
        "date": date.stdout,
    }
    res.send(Parameters);
    shell.exec("rm -rf /home/planet/upload/loadData");
});

app.get("/simulation", (req, res) => {
    shell.exec("/home/planet/save_results.sh " + "'Results1' " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/planet/Results1.csv");
    results1 = shell.exec("cat /home/planet/Results1.csv");
    shell.exec("/home/planet/save_results.sh " + "'Results2' " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/planet/Results2.csv");
    results2 = shell.exec("cat /home/planet/Results2.csv");
    status = shell.exec("cat /home/planet/simulationStatus.txt");
    finalResults = {
        'results1': results1.stdout,
        'results2': results2.stdout,
        'status': status.stdout
    }
    res.send(finalResults);
    if (results1.stderr === '' && results2.stderr === '') {
        shell.exec("rm /home/planet/Results1.csv");
        shell.exec("rm /home/planet/Results2.csv");
        shell.exec("rm -f /home/planet/simulationStatus.txt");
    }
});

app.get("/multi_simulation", (req, res) => {
    shell.exec("/home/planet/save_results.sh " + "'multi1Results1' " + "\"" + req.query.formName1 + "\"");
    shell.exec("/home/planet/save_results.sh " + "'multi1Results2' " + "\"" + req.query.formName1 + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/planet/multi1Results1.csv");
    shell.exec("sed -i '/^,,.*/d' /home/planet/multi1Results2.csv");
    results1 = shell.exec("cat /home/planet/multi1Results1.csv");
    shell.exec("/home/planet/save_results.sh " + "'multi2Results1' " + "\"" + req.query.formName2 + "\"");
    shell.exec("/home/planet/save_results.sh " + "'multi2Results2' " + "\"" + req.query.formName2 + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/planet/multi2Results1.csv");
    shell.exec("sed -i '/^,,.*/d' /home/planet/multi2Results2.csv");
    results2 = shell.exec("cat /home/planet/multi2Results1.csv");
    finalResults = {
        'results1': results1.stdout,
        'results2': results2.stdout
    }
    res.send(finalResults);
    if (results1.stderr === '' && results2.stderr === '') {
        shell.exec("rm /home/planet/multi1Results*.csv");
        shell.exec("rm /home/planet/multi2Results*.csv");
    }
});

app.post("/create_user", api.create_user);
app.post("/update_user", api.update_user);
app.post("/login_with_email_password", api.login_with_email_password);
app.post("/login_with_token", api.login_with_token);
app.post("/logout", api.logout);
app.post("/get_user_list", api.get_user_list);
app.post("/remove_user", api.remove_user);
app.post("/forgot", api.forgot);
app.post("/reset", api.reset);
app.post("/refresh", api.refresh);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
