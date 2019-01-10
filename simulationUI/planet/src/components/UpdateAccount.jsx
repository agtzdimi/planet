import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

// semantic-ui
import { Container } from "semantic-ui-react";

import UpdateAccountForm from "./UpdateAccountForm";

class UpdateAccount extends Component {
  render() {
    return (
      <div>
        {this.props.sideBar}
        <Container className="create_acount" style={{ textAlign: "center" }}>
          <UpdateAccountForm />
        </Container>
      </div>
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
export default withRouter(connect(mapStateToProps)(UpdateAccount));
