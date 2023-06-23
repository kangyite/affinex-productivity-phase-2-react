import React from "react";
// import { firebase } from "./firebase";

import { Routes, Route } from "react-router-dom";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import {} from "./App.css";
import GuardedRoute from "./components/GuardedRoute";
import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";
import Timer from "./page/timer";
import NavBar from "./components/navbar";
import Data from "./page/data";
const App = () => {
	return (
		<div style={{display: "flex",}}>
			<div className="navBar" >
				<NavBar />
			</div>
			<div>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />

					<Route path="/" element={<GuardedRoute Component={Home} />} />
					<Route
						path="/timer/:id"
						element={<GuardedRoute Component={Timer} />}
					/>
					<Route path="/data" element={<GuardedRoute Component={Data} />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;
