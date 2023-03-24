import React, { useEffect } from "react";
// import { firebase } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import {} from "./App.css";
import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";
import Timer from "./page/timer";
import NavBar from "./components/navbar";
import Data from "./page/data";
const App = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const auth = getAuth();
		const path = window.location.pathname;
		onAuthStateChanged(auth, (user) => {
			if (user) {
				navigate(path);
			} else {
				console.log("Not signed in");
				navigate("/login");
			}
		});
		// eslint-disable-next-line
	}, []);

	return (
		<div className="rowC">
			<div className="navBar">
				<NavBar />
			</div>
			<div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/timer/:id" element={<Timer />} />
					<Route path="/data" element={<Data />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;
