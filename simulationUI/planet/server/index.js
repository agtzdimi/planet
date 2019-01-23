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
    let uploadFile = req.files.file;
    const fileName = req.files.file.name;
    uploadFile.mv(`${__dirname}/../public/files/${fileName}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        if(fileName === "Parameters_initialization.txt") {
           shell.echo(req.body.param1).to(`${__dirname}/../public/files/${fileName}`);
        }
        else if(fileName === "Control_initialization.txt") {
           shell.echo(req.body.param2).to(`${__dirname}/../public/files/${fileName}`);
        }
        else if(fileName === "Economy_environment_initialization.txt") {
           shell.echo(req.body.param3).to(`${__dirname}/../public/files/${fileName}`);
        }

        res.json({
            file: `public/${req.files.file.name}`
        });
    });
});

app.post("/transfer", (req, res) => {
    console.log(req.body);
    shell.exec("/home/sitewhere/simulate.sh");
    return res.send("Transfer Completed");
});

app.get("/simulation", (req, res) => {
    results = shell.exec("cat /home/sitewhere/results.csv");
    res.send(results);
});

app.get("/simulation2", (req, res) => {
    results = shell.exec("cat /home/sitewhere/results2.csv");
    res.send(results);
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
