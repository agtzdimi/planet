const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const shell = require("shelljs");
const app = express();
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use(fileUpload());
app.use("/public", express.static(__dirname + "../public"));

app.post("/upload", (req, res, next) => {
    shell.echo(req.body.param1).to(`${__dirname}/../public/files/Parameters_initialization.txt`);
    shell.echo(req.body.param2).to(`${__dirname}/../public/files/Control_initialization.txt`);
    shell.echo(req.body.param3).to(`${__dirname}/../public/files/Economy_environment_initialization.txt`);
    for (const fil of Object.keys(req.files.file)) {
        let uploadFile = req.files.file[fil];
        const fileName = req.files.file[fil].name;
        uploadFile.mv(`${__dirname}/../public/files/${fileName}`, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
    }
    res.json({
        file: `public/${req.files.file.name}`
    });
});

app.post("/save_data", (req, res, next) => {
    shell.exec("/home/sitewhere/generateData.sh '" + req.body.windPayload + "' '" + req.body.pvPayload + "'");
    return res.send("Success");
});

app.get("/get_form_names", (req, res) => {
    shell.exec("mongoexport --db planet --collection files --out /home/sitewhere/allDocuments.txt");
    formName = shell.exec("egrep -o 'formName.*' /home/sitewhere/allDocuments.txt | sed 's/\"//g' | sed 's/{//g' | sed 's/}//g' | sed 's/,.*//' | cut -d : -f2 | sort -u");
    formDescr = shell.exec("egrep -o 'formDescription.*' /home/sitewhere/allDocuments.txt | sed 's/\"//g' | sed 's/{//g' | sed 's/}//g' | sed 's/,.*//' | cut -d : -f2 | sort -u");
    res.send({"formName": formName, "formDescription": formDescr});
    shell.exec("rm -f /home/sitewhere/allDocuments.txt");
});

app.post("/transfer", (req, res) => {
    shell.exec("/home/sitewhere/simulate.sh " + "\"" + req.body.formName + "\"");
    return res.send("Transfer Completed");
});

app.get("/load_data", (req, res) => {
    shell.exec("/home/sitewhere/load_data.sh " + "\"" + req.query.formName + "\"");
    paramInitParam = shell.exec("cat /home/sitewhere/upload/loadData/Parameters_initialization.txt");
    econEnvParam = shell.exec("cat /home/sitewhere/upload/loadData/Economy_environment_initialization.txt");
    controlParam = shell.exec("cat /home/sitewhere/upload/loadData/Control_initialization.txt");
    electrParam = shell.exec("cat /home/sitewhere/upload/loadData/Electricity.xlsx");
    heatParam = shell.exec("cat /home/sitewhere/upload/loadData/Heat.xlsx");
    Parameters = {
    "paramInit": paramInitParam,
    "econEnv": econEnvParam,
    "controlSystem": controlParam,
    "electricity": electrParam,
    "heat": heatParam
    }
    res.send(Parameters);
    shell.exec("rm -rf /home/sitewhere/upload/loadData");
});

app.get("/simulation", (req, res) => {
    shell.exec("/home/sitewhere/save_results.sh " + "Results1 " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/Results1.csv");
    results = shell.exec("cat /home/sitewhere/Results1.csv");
    res.send(results);
    shell.exec("rm /home/sitewhere/Results1.csv");
});

app.get("/simulation2", (req, res) => {
    shell.exec("/home/sitewhere/save_results.sh " + "Results2 " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/Results2.csv");
    results = shell.exec("cat /home/sitewhere/Results2.csv");
    res.send(results);
    shell.exec("rm /home/sitewhere/Results2.csv");
});

app.get("/multi_simulation", (req, res) => {
    shell.exec("/home/sitewhere/save_results.sh " + "multi1Results1 " + "\"" + req.query.formName + "\"");
    shell.exec("/home/sitewhere/save_results.sh " + "multi1Results2 " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/multi1Results1.csv");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/multi1Results2.csv");
    results = shell.exec("cat /home/sitewhere/multi1Results1.csv");
    res.send(results);
    shell.exec("rm /home/sitewhere/multi1Results*.csv");
});

app.get("/multi_simulation2", (req, res) => {
    shell.exec("/home/sitewhere/save_results.sh " + "multi2Results1 " + "\"" + req.query.formName + "\"");
    shell.exec("/home/sitewhere/save_results.sh " + "multi2Results2 " + "\"" + req.query.formName + "\"");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/multi2Results1.csv");
    shell.exec("sed -i '/^,,.*/d' /home/sitewhere/multi2Results2.csv");
    results = shell.exec("cat /home/sitewhere/multi2Results1.csv");
    res.send(results);
    shell.exec("rm /home/sitewhere/multi2Results*.csv");
});


app.post("/create_user", api.create_user);
app.post("/update_user", api.update_user);
app.post("/login_with_email_password", api.login_with_email_password);
app.post("/login_with_token", api.login_with_token);
app.post("/logout", api.logout);
app.post("/get_user_list", api.get_user_list);
app.post("/remove_user", api.remove_user);

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
