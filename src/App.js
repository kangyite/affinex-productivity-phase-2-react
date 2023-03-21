import React, { Component } from "react";
// import { firebase } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";
import Timer from "./page/timer";

class App extends Component {
	state = {};

	componentDidMount() {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log("signed in");
				this.props.navigate("/");
			} else {
				console.log("Not signed in");
				this.props.navigate("/login");
			}
		});
		window.addEventListener("showRefreshSnack", this.showRefreshSnack);
	}
	componentWillUnmount() {
		window.removeEventListener("showRefreshSnack", this.showRefreshSnack);
		if (this.detachSiteInfo) {
			this.detachSiteInfo();
		}
	}
	showRefreshSnack = () => {
		this.snackbar.MDComponent.show({
			message: "Site updated. Refresh this page for better experience.",
			actionText: "Refresh",
			timeout: 5000,
			actionHandler: () => {
				console.log("oi");
				window.location.reload();
			},
		});
	};
	render() {
		return (
			<div>
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/signup" Component={Signup} />
					<Route path="/login" Component={Login} />
					<Route path="/timer/:id" Component={Timer} />
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
