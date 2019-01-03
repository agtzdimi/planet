import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./components/SubmitFile";
import SubmitFile from "./components/SubmitFile";
import Simulate from "./components/Simulate";
import { BrowserRouter, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import CreateAccont from "./components/CreateAccont";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

import * as MyAPI from "./utils/MyAPI";

// redux
import { connect } from "react-redux";

import { withRouter } from "react-router";

import { LOCAL_STRAGE_KEY } from "./utils/Settings";
import { loginWithEmailRedux } from "./actions/UserActions";

class App extends Component {
  componentDidMount() {
    // Login check

    const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY);
    if (!storage_data) {
      return;
    }

    const storage_json = JSON.parse(storage_data);
    if (storage_json && storage_json.login_token) {
      this.signinWithTokenRequest(storage_json.login_token);
    }
  }

  signinWithTokenRequest = login_token => {
    // login with token

    const param = {
      login_token: login_token
    };

    MyAPI.signinWithToken(param)
      .then(data => {
        return new Promise((resolve, reject) => {
          if (data.status !== "success") {
            reject("error");
          } else {
            // success
            const params = {
              user: data.user,
              login_token: data.login_token
            };
            localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params));
            this.props.mapDispatchToLoginWithPassword(params);
            resolve();
          }
        });
      })
      .catch(err => {
        console.log("err:", err);
        localStorage.removeItem(LOCAL_STRAGE_KEY);
      });
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/notfound" component={NoMatch} />

          <Route exact path="/logout" render={() => <Dashboard />} />

          <Route exact path="/create_acount" render={() => <CreateAccont />} />

          <Route
            exact={true}
            path="/home"
            render={() => (
              <div className="App">
              <ul className="header">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="dashboard">Simulation Results</a>
            </li>
          </ul>
                <SubmitFile
                  message="Upload Components and Simulation Parameter File"
                  id="file1"
                />
                <SubmitFile message="Upload Energy Load File" id="file2" />
                <SubmitFile message="Upload Simulink File" id="file3" />
              </div>
            )}
          />
          <Route
            exact={true}
            path="/dashboard"
            render={() => (
              <div className="App">
              <ul className="header">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="dashboard">Simulation Results</a>
            </li>
          </ul>
                <Simulate />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps({ categories }) {
  return {
    categories
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mapDispatchToLoginWithPassword: data =>
      dispatch(loginWithEmailRedux({ params: data }))
  };
}

export default App;
