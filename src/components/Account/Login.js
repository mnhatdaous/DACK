import React, { Component } from "react";
import { Redirect } from 'react-router-dom'

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Link } from "react-router-dom";
import SignUp from "./SignUp"

import "../../utils/login.css";

const ContentLeft = () => {
    return (
        <div className="contentLeft">
      <div className="inline">
        <p>
          <i class="fas fa-search" /> <span>Follow your interests</span>.
        </p>
        <p>
          <i class="fas fa-users" />{" "}
          <span>Hear what people are talking about</span>.
        </p>
        <p>
          <i class="far fa-comment" /> <span>Join the conversation</span>.
        </p>
      </div>
    </div>
    );
};

// public_key: "GA6GMNHXZ332WAYNW3Q2AJ7YKE5WFYCTOAFJLNEFARHKWTMT7HQR2ZIK",
// private_key: "SC3PILQTZKA7EYDVUV5VV2LEV4TI4O7DVLR5F7JG3JVENBEBHMLUXMP2",
// test
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                password: '',
                isLogin: false
            }
        };
    }

    onOpenPost = () => {
        this.setState({ open: true });
    };

    onClosePost = () => {
        this.setState({ open: false });
    };

    loginConnectServer = () => {
        return true;
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/home' />
        }
    }

    handleLogin = (event) => {
        event.preventDefault();
        this.setState({
            user: {
                username: event.target.username.value.toString(),
                password: event.target.password.value.toString(),
            }
        })
        this.props.onLogIn(this.state.user);
        this.setState({
            user: {
                username: '',
                password: '',
            }
        });
    }

    render() {

        if (this.props.auth.isUserSignedIn)
            return <Redirect to='/home' />;

        return (
            <div>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <div className="leftBar">
              <ContentLeft />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="rightLogin">
              <div className="blockFromLogin">
                <form onSubmit = {this.handleLogin} >
                  <div className="formLogin">
                    <div className="inline">
                      <TextField
                        label="username"
                        name="username"
                        margin="dense"
                      />
                    </div>
                    <div className="inline2">
                      <div>
                        <TextField
                          label="Password"
                          type="password"
                          name="password"
                          margin="normal"
                        />
                      </div>
                      <Link to="/login"> forgot password?</Link>
                    </div>
                    <div className="inline3">
                      <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                      >
                        Log In
                    </Button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="blockContent">
                <i class="fab fa-twitter" />
                <h2>See what’s happening in the world right now </h2>
              </div>
              <div className="clockSignUp">
                <p style={{ marginLeft: "50px" }}>Join us today!!!</p>
                <Button onClick={() => this.props.onSignUp()} className="sign-up" variant="contained" color="primary">
                  Sign Up
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>

        <Dialog
          open={this.state.open}
          onClose={this.onClosePost}
          aria-labelledby="form-dialog-title"
        >
          <SignUp />
        </Dialog>

      </div>
        );
    }
}

export default Login;