import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Input, Label, Col, Alert, Row } from "reactstrap";
import tokenService from "../services/token.service";

export default function Login({ message, navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(event) {
		event.preventDefault();
		const reqBody = {
			username: username,
			password: password,
		};

		fetch("/api/v1/auth/signin", {
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
				if (navigation === true) {
					return window.location.reload();
				}
				else window.location.assign("/dashboard");
			}).catch((message) => {
				alert(message);
			}
			);
	}

	return (
		<div>
			<Container style={{ marginTop: "15px" }} fluid="lg">
				{message ? <Alert color="primary">
					{message}
				</Alert> : <></>}
				<h2 className="text-center">Sign in</h2>
				<Row>
					<Col></Col>
					<Col md="5" lg="3" sm="5">
						<Form onSubmit={handleSubmit}>
							<FormGroup>
								<Label for="username">Username</Label>
								<Input type="text" required name="username" id="username" value={username || ''}
									onChange={(e) => setUsername(e.target.value)} />
							</FormGroup>
							<FormGroup>
								<Label for="password">Password</Label>
								<Input type="password" required name="password" id="password" value={password || ''}
									onChange={(e) => setPassword(e.target.value)} />
							</FormGroup>
							<br />
							<FormGroup>
								<Button className="save-button" type="submit">Login</Button>{' '}
								<Button className="cancel-button" tag={Link} to="/">Cancel</Button>
							</FormGroup>
						</Form>
						{!navigation ? <p className="text-center">You are not registered? <a href="/register" tag={Link} to="register">Sign up</a></p> : <></>}
					</Col>
					<Col></Col>
				</Row>

			</Container>
		</div >
	);
};