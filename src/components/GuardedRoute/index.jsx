import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const GuardedRoute = ({ Component }) => {
	const [isAuthed, setIsAuthed] = useState(true);
	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsAuthed(true);
			} else {
				console.log("Not signed in");
				setIsAuthed(false);
			}
		});
	}, []);

	return isAuthed ? <Component /> : <Navigate to="/login" />;
};

export default GuardedRoute;
