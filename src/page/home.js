import React, { Component } from "react";
import { db } from "../firebase";
import { onValue, ref, get, child } from "firebase/database";
class Home extends Component {
	state = {};
	componentDidMount() {
		const query = ref(db, "devices");
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				const data = Object.values(snapshot.val());
				data.forEach((c) => {
					console.log(Object.keys(c));
				});
			}
		});
	}
	render() {
		return <h1>ASd</h1>;
	}
}

export default Home;
