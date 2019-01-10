import React, { Component } from 'react';
import { Button, Form, Grid, Container, Transition } from 'semantic-ui-react'
import { Link } from "react-router-dom";

const transitions = 'slide down'


class ManageAccounts extends Component {

    handleClick = () => this.setState({ active: !this.state.active })

    state = { animation: transitions }


    render() {
        let users = null

        const { active } = this.state
        if (this.state.active) {
            users = this.props.userList
        }

        return (
            <div>
                {this.props.sideBar}
                <Container text className="create_acount_form">
                    <Form onSubmit={this.onSubmit} style={{ marginTop: 30 }}>
                        <Grid>
                            <Grid.Column textAlign="center" width={16}>
                                <Button toggle color="blue" content="List all Users" active={active} onClick={this.handleClick} size="large" icon="list ul" labelPosition='left' />
                                <Button as={Link} to="/create_account" className="m-2" content="Add New User" color="blue" size="large" icon="add user" labelPosition='right' />
                            </Grid.Column>
                            <Transition.Group animation={this.state.animation}>
                                {users}
                            </Transition.Group>
                        </Grid>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default ManageAccounts;