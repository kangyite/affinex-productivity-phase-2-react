import React, { useEffect } from "react";
// import { firebase } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";
import Timer from "./page/timer";

const App = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log("signed in");
				navigate("/");
			} else {
				console.log("Not signed in");
				navigate("/login");
			}
		});
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/timer/:id" element={<Timer />} />
			</Routes>
		</div>
	);
};

export default App;
