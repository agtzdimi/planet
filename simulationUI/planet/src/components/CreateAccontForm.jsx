import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Label } from "react-bootstrap";
import { newUser } from "../actions/UserActions";

// semantic-ui
import { Container, Form, Input, Button, Grid, Checkbox, Icon } from "semantic-ui-react";

// API
import * as MyAPI from "../utils/MyAPI";
import { loginWithEmailRedux } from "../actions/UserActions";

class CreateAccontForm extends Component {
    state = {
        name: "",
        surname: "",
        email: "",
        password: "",
        message: "",
        isAdmin: false
    };

    handleCheckBoxChange = () => {
        let checkBoxState = this.state.isAdmin
        this.setState({ isAdmin: !checkBoxState })
    }

    onSubmit = () => {
        const { email, password, isAdmin, name, surname } = this.state;

        const params = {
            email: email,
            password: password,
            isAdmin: isAdmin,
            name: name,
            surname: surname
        };

        // create account
        MyAPI.createAccount(params)
            .then(data => {
                // save account
                if (data.status === "error") {
                    throw new Error(data.detail);
                }
                this.props.mapDispatchNewUser()
            })
            .then(() => {
                // redirect
                this.props.history.push("/manage_accounts");
            })
            .catch(err => {
                this.setState({ message: "" + err })
            });
    };

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    render() {
        const { email, password, name, surname } = this.state;

        return (
            <Container text className="create_acount_form">
                <Form onSubmit={this.onSubmit} style={{ marginTop: 60 }}>
                    <Grid>

                        <Grid.Column textAlign="center" width={16}>
                            <Icon size='massive' name='user circle' />
                        </Grid.Column>

                        <Grid.Column textAlign="left" width={16}>
                            <label>Name</label>
                            <Input
                                style={{ width: "100%" }}
                                icon="id card outline"
                                iconPosition="left"
                                name="name"
                                onChange={this.handleChange}
                                value={name}
                                placeholder="Name"
                            />
                        </Grid.Column>

                        <Grid.Column textAlign="left" width={16}>
                            <label>Surname</label>
                            <Input
                                style={{ width: "100%" }}
                                icon="id card"
                                iconPosition="left"
                                name="surname"
                                onChange={this.handleChange}
                                value={surname}
                                placeholder="Surname"
                            />
                        </Grid.Column>

                        <Grid.Column textAlign="left" width={16}>
                            <label>Email</label>
                            <Input
                                style={{ width: "100%" }}
                                icon="mail"
                                iconPosition="left"
                                name="email"
                                onChange={this.handleChange}
                                value={email}
                                placeholder="yourname@example.com"
                            />
                        </Grid.Column>

                        <Grid.Column textAlign="left" width={16}>
                            <label>Password</label>
                            <Input
                                style={{ width: "100%" }}
                                icon="key"
                                iconPosition="left"
                                name="password"
                                onChange={this.handleChange}
                                value={password}
                                placeholder="********"
                            />
                        </Grid.Column>

                        <Grid.Column textAlign="left" width={16}>
                            <label>Admin</label>
                            <Checkbox
                                style={{ width: "100%" }}
                                onChange={this.handleCheckBoxChange}
                            />
                        </Grid.Column>

                        <Grid.Column width={16}>
                            <Button
                                primary
                                style={{ width: "100%" }}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                type="submit"
                            >
                                Create an account
                            </Button>
                        </Grid.Column>
                        <Grid.Column textAlign="center" width={16}>
                            <Label className="text-danger" style={{ fontSize: "16px" }}>{this.state.message} </Label>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Container>
        );
    }
}

// react-redux
function mapStateToProps({ user }) {
    return {
        user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapDispatchToLoginWithPassword: data =>
            dispatch(loginWithEmailRedux({ params: data })),
        mapDispatchNewUser: () =>
            dispatch(newUser())
    };
}

// export default withRouter(MainPage);
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CreateAccontForm)
);
