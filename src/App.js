import React, { Component } from "react";
// import { firebase } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";

class App extends Component {
	state = {};

	componentDidMount() {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.props.navigate("/");
			} else {
				this.props.navigate("/login");
			}
		});
	}

	render() {
		return (
			<div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		);
	}
}
function WithNavigate(props) {
	let navigate = useNavigate();
	return <App {...props} navigate={navigate} />;
}
export default WithNavigate;
