import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./components/SubmitFile";
import SubmitFile from "./components/SubmitFile";
import Simulate from "./components/Simulate";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import CreateAccont from "./components/CreateAccont";
import { Segment, Menu, Image, Icon, Sidebar } from "semantic-ui-react";
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

  state = {
    renderAcounts: false
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ renderAcounts: nextProps.user.user.isAdmin })
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
              login_token: data.login_token,
              isAdmin: data.isAdmin
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

  getSideBar = () => {
    return (
      <div style={{ height: '100vh', position: "absolute", width: "17vh" }}>
        < Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin'>
            <Menu.Item as={Link} to="/home">
              <Icon name='home' />
              Home
                </Menu.Item>
            <Menu.Item as={Link} to="/dashboard">
              <Icon name='line graph' />
              Simulations
                </Menu.Item>
            {this.state.renderAcounts ? (<Menu.Item as={Link} to="/manage_acounts">
              <Icon name='users' />
              Manage Acounts
                </Menu.Item>) : null}
            <Menu.Item as={Link} to="/logout">
              <Icon name='log out' />
              Log Out
                </Menu.Item>
          </Sidebar>
        </Sidebar.Pushable >
      </div >)
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Segment inverted>
            <Menu inverted secondary>
              <Image src='./planet.png' style={{ height: "85px", width: "120px" }} href="/home" />
            </Menu>
          </Segment>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/notfound" component={NoMatch} />

          <Route exact path="/logout" render={() => <Dashboard />} />

          <Route exact path="/manage_accounts" render={() => <CreateAccont />} />

          <Route
            exact={true}
            path="/home"
            render={() => (
              <div className="App">
                <SubmitFile
                  message="Upload Components and Simulation Parameter File"
                  id="file1"
                  sideBar={this.getSideBar()}
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
                <Simulate sideBar={this.getSideBar()} />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mapDispatchToLoginWithPassword: data =>
      dispatch(loginWithEmailRedux({ params: data }))
  };
}

// export default App;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
