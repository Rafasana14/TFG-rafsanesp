import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Input, Label, Col, Alert, Row } from "reactstrap";
import tokenService from "../services/token.service";
import useErrorModal from "../util/useErrorModal";

export async function login(username, password, navigation, setMessage, setVisible) {
	await fetch("/api/v1/auth/signin", {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body: JSON.stringify({ username: username, password: password }),
	}).then(function (response) { return response.json(); })
		.then(function (data) {
			if (data.message) {
				setMessage(data.message);
				setVisible(true);
			} else {
				tokenService.setUser(data);
				tokenService.updateLocalAccessToken(data.token)
				if (navigation === true) {
					return window.location.reload();
				}
				else window.location.assign("/dashboard");
			}
		}).catch((message) => {
			alert(message);
		}
		);
}

export default function Login({ expiration, navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [visible, setVisible] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		await login(username, password, navigation, setMessage, setVisible);
	}

	const modal = useErrorModal(setVisible, visible, message);
	return (
		<div>
			<Container style={{ marginTop: "15px" }} fluid="lg">
				{expiration ? <Alert color="primary">
					{expiration}
				</Alert> : <></>}
				{modal}
				<h2 className="text-center">Sign in</h2>
				<Row>
					<Col></Col>
					<Col md="5" lg="3" sm="5">
						<Form onSubmit={(e) => { (async () => { await handleSubmit(e); })(); }}>
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
							<FormGroup align='center'>
								<Button className="save-button" type="submit">Login</Button>{' '}
								<Button className="back-button" tag={Link} to="/">Cancel</Button>
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