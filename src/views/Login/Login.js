import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import config from "../../config";
import BigSpinner from "../../components/_shared/BigSpinner";
import MyInput from "./MyInput";
import AuthService from "../../services/AuthService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
    // this.userService = new UserService();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.title = "Login";
    window.addEventListener("message", this.handleFrameTasks);
    if (this.props.user) {
      this.props.history.push("/dashboard");
    }
  }

  componentDidUpdate(prevProps) {
    //  TODO: Only send token to admin app if the user is venue manager or admin (dont send token is the user is player)
    // if (this.props.user) {
    //   const token = localStorage.getItem("token");
    //   this.iFrame.current.contentWindow.postMessage(
    //     JSON.stringify({ key: "token", method: "set", data: token }),
    //     "*"
    //   );
    // }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleValidation() {
    const { email, password } = this.state;
    let errors = {};

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = "The email must be a valid email address.";
    }

    if (email === "") {
      errors.email = "The email field is required.";
    }

    // if (password.length < 6) {
    //   errors.password = "The password must be at least 6 characters.";
    // }

    if (password === "") {
      errors.password = "The password field is required.";
    }

    if (Object.keys(errors).length === 0) {
      this.setState({ errors: errors });
      return true;
    } else {
      this.setState({ errors: errors });
      return false;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };
      try {
        const response = await this.authService.login(
          user.email,
          user.password
        );
        const data = response.data;
        this.props.loginUser(data.user);
        localStorage.setItem("token", data.authorization.access_token);
        this.props.history.push("/dashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }

  render() {
    const renderButton = this.props.loginRequest ? (
      <div style={{ maxWidth: 325 }}>
        <BigSpinner width={45} customClasses="d-flex justify-content-center" />
      </div>
    ) : (
      <button type="submit" className="button-big">
        Login
      </button>
    );

    return (
      <div className="auth-background text-center">
        <div className="container auth-container">
          <div className="row">
            <div
              className="col-md-6 d-flex flex-column align-items-center"
              style={{ borderRight: "1px solid #ffffff" }}
            >
              <h1 style={{ color: "#ffffff" }}>We are football</h1>
            </div>
            <div className="col-md-6">
              <div className="login-form-wrap">
                <h1 className="text-left">Login</h1>
                <form onSubmit={this.handleSubmit}>
                  <div className="app-login-wrap">
                    <div className="form-group">
                      <MyInput
                        type="email"
                        name="email"
                        value={this.state.email}
                        placeholder="Email address"
                        stateError={this.state.errors.email}
                        onChange={this.handleInputChange.bind(this)}
                      />
                    </div>
                    <div className="form-group">
                      <MyInput
                        type="password"
                        name="password"
                        value={this.state.password}
                        placeholder="Password"
                        stateError={this.state.errors.password}
                        onChange={this.handleInputChange.bind(this)}
                      />
                    </div>
                    <div className="submit-button" style={{ height: 65 }}>
                      {renderButton}
                    </div>
                    {this.props.location.state && (
                      <div className="register-success">
                        <p className="m-0">
                          {this.props.location.state.sucess +
                            " You can login now"}
                        </p>
                      </div>
                    )}
                    <div className="pt-3 extra-links">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <div className="register-error">
                      {this.props.loginFail && (
                        <p className="m-0">{this.props.loginFail}</p>
                      )}
                    </div>
                  </div>

                  <div className="extra-links" style={{ paddingTop: 25 }}>
                    <Link to="/register" className="link-default">
                      No account? Register new one here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
