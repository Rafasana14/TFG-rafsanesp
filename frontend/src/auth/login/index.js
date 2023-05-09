import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Input, Label, Col, Alert } from "reactstrap";
import tokenService from "../../services/token.service";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      navigation: props.navigation ? props.navigation : false,
      children: props.children ? props.children : null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const reqBody = {
      username: this.state.username,
      password: this.state.password,
    };

    await (fetch("/api/v1/auth/signin", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(reqBody),
    }).then(function (response) {
      if (response.status === 200)
        return response.json();
      else
        return Promise.reject("Invalid login attempt");
    })
      .then(function (data) {
        tokenService.setUser(data);
        tokenService.updateLocalAccessToken(data.token)
      }).catch((message) => {
        alert(message);
      }));
    if (this.state.navigation === true) {
      return window.location.reload();
    }
    else window.location.href = "/dashboard";
  }

  render() {
    return (
      <div>
        {this.state.message ? <Alert color="primary">
          {this.state.message}
        </Alert> : <></>}
        <Container style={{ marginTop: "15px" }} className="d-flex justify-content-center">
          <Form onSubmit={this.handleSubmit}>
            <Col>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input type="text" required name="username" id="username" value={this.state.username || ''}
                  onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" required name="password" id="password" value={this.state.password || ''}
                  onChange={this.handleChange} />
              </FormGroup>
              <br />
              <FormGroup>
                <Button color="primary" type="submit">Login</Button>{' '}
                <Button color="secondary" tag={Link} to="/">Cancel</Button>
              </FormGroup>
            </Col>
          </Form>
        </Container>
      </div>
    );
  };
}

export default Login;
