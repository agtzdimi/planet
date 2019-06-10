const uuid = require("uuid");
const sha256 = require("sha256");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const async = require('async');
const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
    planetPort,
    planetIP } = require('../bin/www');

// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKEY = fs.readFileSync('./server/keys/private.key', 'utf8');
const publicKEY = fs.readFileSync('./server/keys/public.key', 'utf8');

// change this
const db_name = "planet";

// Connection URL
const MongoDbHelper = require("./MongoDbHelper");
let url = "mongodb://" + mongoUser + ':' + mongoPass + '@' + mongoIP + ':' + mongoPort + "/" + db_name + '?authSource=admin';
console.log(url)
let mongoDbHelper = new MongoDbHelper(url);

getJwtToken = (payload) => {

    const signOptions = {
        expiresIn: "1d",    // 30 days validity
        algorithm: "RS256"
    };

    try {
        return jwt.sign(payload, privateKEY, signOptions);
    } catch (err) {
        console.log(err)
        return err;
    }
}

verifyJwtToken = (token) => {
    const verifyOptions = {
        expiresIn: "1d",
        algorithm: ["RS256"]
    };
    try {
        return jwt.verify(token, publicKEY, verifyOptions);
    } catch (err) {
        return false;
    }
}

decodeJwtToken = (token) => {
    return jwt.decode(token, { complete: true });
    //returns null if token is invalid
}

// start connection
mongoDbHelper.start(() => {
    console.log("mongodb ready");
});


// generate random string
function makeid(count) {
    if (!count) {
        count = 5;
    }

    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// index
exports.echo = (req, res) => {
    const { login_token } = req.session;

    res.json({
        status: "OK",
        login_token: login_token
    });
};

// create user
exports.create_user = (req, res) => {
    let password = req.body.parameters.password;
    let email = req.body.parameters.email;
    let isAdmin = req.body.parameters.isAdmin;
    let fullName = req.body.parameters.fullName;

    console.log(email, password, email, isAdmin)
    let user_info = {};
    let login_token;

    let find_param = {
        "emails.address": email
    };
    mongoDbHelper
        .collection("users")
        .count(find_param)
        .then(results => {
            return new Promise((resolve, reject) => {

                if (results !== 0) {
                    reject("user already exist!");
                }
                resolve();
            });
        })
        .then(() => {
            // bcrypt of password
            let password2 = sha256(password);
            var bcrypt_hash = bcrypt.hashSync(password2, 10);

            // login token which to use login
            login_token = getJwtToken({ email: email, fullName: fullName });
            const hashed_token = crypto
                .createHash("sha256")
                .update(login_token)
                .digest("base64");

            const token_object = {
                loggedIn: new Date(),
                hashedToken: hashed_token,
                loggedOut: new Date(),
                logStatus: "false"
            };

            let insert_params = {
                createdAt: new Date(),
                services: {
                    password: {
                        bcrypt: bcrypt_hash
                    },
                    resume: {
                        loginTokens: [token_object]
                    },
                    email: {
                        verificationTokens: [
                            {
                                // nameHash : nameHash,
                                address: email,
                                when: new Date()
                            }
                        ]
                    }
                },
                emails: [
                    {
                        address: email,
                        verified: false
                    }
                ],
                isAdmin: isAdmin,
                fullName: fullName,
                profile: {}
            };

            // insert
            return mongoDbHelper.collection("users").insert(insert_params);
        })
        .then(results => {
            if (results === null) {
                res.json({ status: "error", detail: "no such user" });
                return;
            }

            user_info._id = results._id;
            user_info.profile = results.profile;

            // req.session.userId = user_info._id
            req.session.login_token = login_token; // maybe not necessary

            res.json({
                status: "success",
                data: {
                    token: login_token,
                },
            });
        })
        .catch(err => {
            res.json({ status: "error", detail: err });
        });

};

// login with email and password
exports.login_with_email_password = (req, res) => {
    let password = req.body.password;
    let email = req.body.email;

    let find_param = {
        "emails.address": email
    };

    let user_info = {};
    let login_token;

    // insert
    mongoDbHelper
        .collection("users")
        .findOne(find_param)
        .then(results => {
            // check password

            return new Promise((resolve, reject) => {
                if (!results) {
                    reject("The email provided is not registered!");
                }
                if (
                    !results.services ||
                    !results.services.password ||
                    !results.services.password.bcrypt
                ) {
                    reject("something must be wrong");
                }

                // set user info
                user_info._id = results._id;
                user_info.profile = results.profile;
                user_info.isAdmin = results.isAdmin;
                user_info.fullName = results.fullName;
                user_info.image = results.profile.image;

                let password2 = sha256(password);

                const saved_hash = results.services.password.bcrypt;
                bcrypt.compare(password2, saved_hash, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(err, res)
                    if (res === true) {
                        resolve();
                    } else {
                        reject("password is not valid");
                    }
                });
            });
        })
        .then(() => {
            // issue token

            let find_param = {
                _id: user_info._id
            };

            // login token
            login_token = getJwtToken({ email: email, fullName: user_info.fullName, image: user_info.image });
            const hashed_token = crypto
                .createHash("sha256")
                .update(login_token)
                .digest("base64");

            const token_object = {
                loggedIn: new Date(),
                hashedToken: hashed_token,
                loggedOut: "",
                logStatus: "true"
            };

            let upd_param = {
                $set: {
                    "services.resume.loginTokens": token_object
                }
            };

            // update
            return mongoDbHelper.collection("users").update(find_param, upd_param);
        })
        .then(results => {
            // set session
            req.session.login_token;
            res.json({
                status: "success",
                data: {
                    token: login_token,
                },
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500);
            res.json({
                status: "error", data: {
                    errors: err
                }
            });
        });
};

// logout
exports.logout = (req, res) => {
    let login_token = req.body.login_token;
    if (!login_token) {
        // user is not login
        res.json({ status: "success" });
        return;
    }

    const hashed_token = crypto
        .createHash("sha256")
        .update(login_token)
        .digest("base64");
    let find_param = {
        "services.resume.loginTokens": {
            $elemMatch: {
                hashedToken: hashed_token
            }
        }
    };

    // find user
    mongoDbHelper
        .collection("users")
        .findOne(find_param)
        .then(results => {
            if (results === null) {
                return Promise.reject("no such token");
            }

            let index = 0
            for (let i = 0; i < results.services.resume.loginTokens.length; i++) {
                if (results.services.resume.loginTokens[i].hashedToken === hashed_token) {
                    index = i
                }
            }


            let find_param = {
                loggedOut: results.services.resume.loginTokens.loggedOut,
                logStatus: results.services.resume.loginTokens.logStatus
            };

            const token_object = {
                loggedOut: new Date(),
                logStatus: "false"
            };

            let upd_param = {
                $set: {
                    ["services.resume.loginTokens." + index + ".loggedOut"]: token_object.loggedOut,
                    ["services.resume.loginTokens." + index + ".logStatus"]: token_object.logStatus,
                }
            };

            return mongoDbHelper.collection("users").update(find_param, upd_param);
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            })
        })
        .then(() => {
            res.json({ status: "success" });
        })
        .catch(err => {
            res.json({ status: "error", detail: err });
        });
};

// login_with_token
exports.login_with_token = (req, res) => {
    let login_token = req.body.parameters.login_token;

    let user_info = {};

    const hashed_token = crypto
        .createHash("sha256")
        .update(login_token)
        .digest("base64");
    let find_param = {
        "services.resume.loginTokens": {
            $elemMatch: {
                hashedToken: hashed_token
            }
        }
    };

    // find user
    mongoDbHelper
        .collection("users")
        .findOne(find_param)
        .then(results => {
            // set user info

            if (results === null) {
                res.json({ status: "error", detail: "no such user" });
                return;
            }

            user_info._id = results._id;
            user_info.profile = results.profile;
            user_info.isAdmin = results.isAdmin;
            user_info.fullName = results.fullName;

            // set session
            req.session.login_token;

            // return success
            res.json({
                status: "success",
                user: user_info,
                login_token: login_token
            });
        })
        .catch(err => {
            res.json({ status: "error", detail: err });
            console.log("err:", err);
        });
};

exports.get_user_list = (req, res) => {

    let userList = {}

    // find user
    mongoDbHelper
        .collection("users")
        .find()
        .then(results => {

            if (results === null) {
                return Promise.reject("no such token");
            }
            userList = results.map((user, index) => {
                return ({
                    key: user._id,
                    fullName: user.fullName,
                    isAdmin: user.isAdmin,
                    email: user.emails[0].address
                })
            });
        })
        .then(() => {
            res.json({ userList: userList });
        })
        .catch(err => {
            res.json({ status: "error", detail: err });
        });
};

exports.remove_user = (req, res) => {

    let user = req.body.parameters.userId
    let userList = {}

    // find user
    mongoDbHelper
        .collection("users")
        .delete(user)
        .then(() => {
            mongoDbHelper
                .collection("users")
                .find()
                .then(results => {

                    if (results === null) {
                        return Promise.reject("no such token");
                    }
                    userList = results.map((user, index) => {
                        return ({
                            key: user._id,
                            fullName: user.fullName,
                            isAdmin: user.isAdmin,
                            email: user.emails[0].address
                        })
                    });
                })
                .then(() => {
                    res.json({ userList: userList });
                })
                .catch(err => {
                    res.json({ status: "error", detail: err });
                });
        })
        .catch(err => {
            res.json({ status: "error", detail: err });
        });
};

// update user
exports.update_user = (req, res) => {
    let email = req.body.email;
    let image = req.body.image;

    // find user
    mongoDbHelper
        .collection("users")
        .find({ "emails.address": email })
        .then(results => {
            if (results === null) {
                return Promise.reject("no such user");
            }

            let upd_param = {
                $set: {
                    ["profile.image"]: image,
                }
            };

            return mongoDbHelper.collection("users").update({ "emails.address": email }, upd_param);
        })
        .then(() => {
            res.json({
                status: "success",
                data: {
                    image: image,
                },
            });
        })
        .catch(err => {
            console.log(err)
            res.json({ status: "error", detail: err });
        });
};

exports.refresh = (req, res) => {
    let email = req.body.payload.email;
    let fullName = req.body.payload.fullName;
    let image = req.body.payload.image;
    // find user
    mongoDbHelper
        .collection("users")
        .find({ "emails.address": email })
        .then(results => {
            if (results === null) {
                return Promise.reject("no such user");
            }
            login_token = getJwtToken({ email: email, fullName: fullName, image: image });
            const hashed_token = crypto
                .createHash("sha256")
                .update(login_token)
                .digest("base64");

            const token_object = {
                loggedIn: new Date(),
                hashedToken: hashed_token,
                loggedOut: "",
                logStatus: "true"
            };

            let upd_param = {
                $set: {
                    "services.resume.loginTokens": token_object
                }
            };

            return mongoDbHelper.collection("users").update({ "emails.address": email }, upd_param);
        })
        .then(() => {
            res.json({
                status: "success",
                data: {
                    token: login_token,
                },
            });
        })
        .catch(err => {
            console.log(err)
            res.json({ status: "error", detail: err });
        });
}

exports.forgot = (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            mongoDbHelper
                .collection("users")
                .findOne({ "emails.address": req.body.email })
                .then(user => {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    let upd_param = {
                        $set: {
                            ["resetPasswordToken"]: token,
                            ["resetPasswordExpires"]: Date.now() + 3600000
                        }
                    };

                    mongoDbHelper.collection("users").update({ "emails.address": req.body.email }, upd_param);
                    try {
                        done(null, token, user);
                    } catch (error) {
                        console.log(error)
                    }
                });
        },
        function (token, user, done) {
            try {
                var transporter = nodemailer.createTransport(smtpTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'planet.2019eu@gmail.com',
                        pass: '2019CeRtH!'
                    }
                }));

                var mailOptions = {
                    to: user.emails[0]['address'],
                    from: 'passwordreset@demo.com',
                    subject: 'Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + planetIP + ':' + planetPort + '/#/auth/reset-password/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    const message = 'An e-mail has been sent to ' + user.emails[0]['address'] + ' with further instructions.'
                    // res.json({ message: message });
                    done(err, 'done');
                });
            }
            catch (error) {
                console.log(error)
            }
        }
    ], function (err) {
        if (err) return next(err);
        res.json({ status: "success" });
    });
};

exports.reset = (req, res) => {
    let password = req.body.password;
    mongoDbHelper
        .collection("users")
        .findOne({ "resetPasswordToken": req.body.token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            password = sha256(password);
            const bcrypt_hash = bcrypt.hashSync(password, 10);

            let upd_param = {
                $set: {
                    ["services.password.bcrypt"]: bcrypt_hash,
                }
            };

            mongoDbHelper.collection("users").update({ "resetPasswordToken": req.body.token }, upd_param);
            res.json({ status: "success" });
        })
};  
