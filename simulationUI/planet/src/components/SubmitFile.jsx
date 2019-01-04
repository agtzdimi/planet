import React, { Component } from "react";
import { post } from "axios";
import { withRouter } from "react-router";
import { connect } from "react-redux";

class SubmitFile extends Component {
  state = {
    fileName: "",
    buttonText: "Select File",
    url: "http://localhost:8000/upload",
    data: ""
  };

  onChange(e) {
    let files = e.target.files;
    if (files[0] !== undefined) {
      this.setState({ fileName: files[0].name });
      this.setState({ buttonText: files[0].name });
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = () => {
        const dataFile = new FormData();
        dataFile.append("file", files[0], files[0].name);
        this.setState({ data: dataFile });
      };
    }
  }

  handleUpload = () => {
    post(this.state.url, this.state.data).then(response =>
      console.log("result", response)
    );
  };

  render() {
    console.log("HERE", this.props)
    return (
      <div onSubmit={this.onFormSubmit}>
        {this.props.sideBar}
        <div style={{ marginLeft: "20vh" }}>
          <h3>{this.props.message}</h3>
          <input
            type="file"
            id={this.props.id}
            name="myfile"
            onChange={e => this.onChange(e)}
            style={{
              display: "none"
            }}
          />

          <label htmlFor={this.props.id} className="btn btn-primary m-2">
            {this.state.buttonText}
          </label>
          <input
            className="btn btn-primary m-2"
            name="Submit"
            id="Submit"
            type="submit"
            value="Upload"
            onClick={this.handleUpload}
          />
        </div>
      </div >
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
export default withRouter(connect(mapStateToProps)(SubmitFile));
