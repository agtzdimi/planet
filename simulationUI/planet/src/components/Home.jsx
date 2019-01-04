import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

// semantic-ui
import { Container } from "semantic-ui-react";

import LoginForm from "./LoginForm";

class Home extends Component {

  render() {
    return (
      <Container className="home" style={{ textAlign: "center" }}>
        <LoginForm />
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

// export default withRouter(MainPage);
export default withRouter(connect(mapStateToProps)(Home));
