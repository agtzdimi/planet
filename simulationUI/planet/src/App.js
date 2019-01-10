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
import { Segment, Menu, Image, Icon, Sidebar, List, Label, Button, Confirm } from "semantic-ui-react";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

import * as MyAPI from "./utils/MyAPI";

// redux
import { connect } from "react-redux";

import { withRouter } from "react-router";

import { LOCAL_STRAGE_KEY } from "./utils/Settings";
import { loginWithEmailRedux, resetNewAccount, updateUserAccount } from "./actions/UserActions";
import ManageAccounts from "./components/ManageAccounts";
import UpdateAccount from "./components/UpdateAccount";

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
        renderAcounts: "false",
        creatingUser: "false",
        name: "",
        surname: "",
        userList: [
            {}
        ],
        openDeleteConfirm: false,
        userToBeDeleted: "",
    };

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.user.user !== "undefined") {
            this.setState({
                renderAcounts: nextProps.user.user.isAdmin,
                name: nextProps.user.user.name,
                surname: nextProps.user.user.surname,
            })
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
            <div style={{ height: '100vh', position: "absolute", width: "11vh" }}>
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
                        {this.state.renderAcounts ? (<Menu.Item as={Link} to="/manage_accounts">
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

    openDeleteConfirmation = (userId) => this.setState({ openDeleteConfirm: true, userToBeDeleted: userId })

    cancelDeleteConfirmation = () => this.setState({ openDeleteConfirm: false, userToBeDeleted: "" })

    closeDeleteConfirmation = () => {
        MyAPI.removeUser(this.state.userToBeDeleted)
            .then(data => {
                this.setState({ userList: { ...data } })
            })
            .then(() => {
                this.props.mapDispatchResetNewAccount()
            })
        this.setState({ openDeleteConfirm: false, userToBeDeleted: "" })
    }

    onUpdateUser = (person) => {
        this.props.mapDispatchUpdateAccount({ person })
    }

    getUserList = () => {
        if (typeof this.state.userList.userList === "undefined" || this.props.user.newAccount) {
            MyAPI.getUserList()
                .then(data => {
                    this.setState({ userList: { ...data } })
                })
                .then(() => {

                    this.props.mapDispatchResetNewAccount()
                })
        }
        const users = (
            typeof this.state.userList.userList !== "undefined" ? (
                this.state.userList.userList.map(person => {
                    return (
                        <List.Item key={person.key}>
                            <Icon name='user circle outline' size="huge" />
                            < List.Content >
                                <Label className="m-2" as='a' color='grey' size="large">
                                    {person.name}{" "}{person.surname}
                                    <Label.Detail>Friend</Label.Detail>
                                </Label>
                                <Button as={Link} to="update_account" className="m-2" content='Edit' icon='edit' labelPosition='left' color="grey" size="medium" onClick={() => this.onUpdateUser(person)} />
                                <Button className="m-2" content='Remove' icon='remove user' labelPosition='right' color="grey" onClick={() => this.openDeleteConfirmation(person.key)} />
                            </List.Content>
                        </List.Item>)
                })
            ) : null
        )
        return (
            <div>
                <List animated verticalAlign='middle' size="medium" relaxed='very' >
                    {users}
                </List >
                <Confirm style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: '130px',
                }}
                    open={this.state.openDeleteConfirm}
                    onCancel={this.cancelDeleteConfirmation}
                    onConfirm={this.closeDeleteConfirmation}
                    size="small"
                    content="Are you sure you want to delete the user?" />
            </div>
        )
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
                    <Route exact path="/create_account" render={() => <CreateAccont sideBar={this.getSideBar()} />} />
                    <Route exact path="/update_account" render={() => <UpdateAccount sideBar={this.getSideBar()} />} />

                    <Route exact path="/manage_accounts" render={() => <ManageAccounts sideBar={this.getSideBar()} userList={this.getUserList()} />} />

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
            dispatch(loginWithEmailRedux({ params: data })),
        mapDispatchResetNewAccount: () =>
            dispatch(resetNewAccount()),
        mapDispatchUpdateAccount: (userInfo) =>
            dispatch(updateUserAccount({ params: userInfo }))
    };
}

// export default App;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
