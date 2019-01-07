import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { LOCAL_STRAGE_KEY } from '../utils/Settings'

// API
import * as MyAPI from '../utils/MyAPI'

class Dashboard extends Component {

  logoutRequest = () => {

    const param = {
      login_token: this.props.user.login_token
    }

    MyAPI.logout(param)
      .then((results) => {
        localStorage.removeItem(LOCAL_STRAGE_KEY);
      })
      .catch((err) => {
        console.log("err: ", err)
        localStorage.removeItem(LOCAL_STRAGE_KEY);
        this.props.history.push("/")
      })
  }

  redirectHome = () => {
    this.props.history.push("/")
  }

  render() {

    return (
      <div className='dashboard' style={{ textAlign: 'center' }}>
        {this.logoutRequest()}
        <div style={{ marginTop: 60 }}>
          <div>
            <Button className="btn-primary" onClick={() => this.redirectHome()}>Go to Sign in Page</Button>
          </div>
        </div>

      </div>
    )
  }
}

// react-redux
function mapStateToProps({ user }) {
  return {
    user
  }
}

// export default withRouter(MainPage);
export default withRouter(connect(mapStateToProps)(Dashboard))
