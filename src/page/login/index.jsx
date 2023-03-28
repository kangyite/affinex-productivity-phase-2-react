import React, { Component } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase";
import { NavLink, useNavigate } from "react-router-dom";

class Login extends Component {
	state = {
		form: {
			email: "",
			password: "",
		},
	};
	componentDidMount() {
		document.title = "Login";
	}
	onLogin = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(
			auth,
			this.state.form.email,
			this.state.form.password
		)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				this.props.navigate("/");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};
	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		const { form } = this.state;
		this.setState({
			form: {
				...form,
				[name]: value,
			},
		});
	}
	render() {
		return (
			<div>
				<main>
					<section>
						<div>
							<p> Login </p>

							<form>
								<div>
									<label htmlFor="email-address">Email address</label>
									<input
										id="email-address"
										name="email"
										type="email"
										required
										placeholder="Email address"
										onChange={(e) => this.handleUserInput(e)}
									/>
								</div>

								<div>
									<label htmlFor="password">Password</label>
									<input
										id="password"
										name="password"
										type="password"
										required
										placeholder="Password"
										onChange={(e) => this.handleUserInput(e)}
									/>
								</div>

								<div>
									<button onClick={this.onLogin}>Login</button>
									{/* // <p>{errorLogin()}</p> */}
								</div>
							</form>

							<p className="text-sm text-white text-center">
								No account yet? <NavLink to="/signup">Sign up</NavLink>
							</p>
						</div>
					</section>
				</main>
			</div>
		);
	}
}

function WithNavigate(props) {
	let navigate = useNavigate();
	return <Login {...props} navigate={navigate} />;
}

export default WithNavigate;
