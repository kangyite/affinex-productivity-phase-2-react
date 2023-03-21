import React, { Component } from "react";
import {} from "./style.css";
// import { db } from "../../firebase";
// import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
class Timer extends Component {
	state = {
		timerData: [],
	};
	componentDidMount() {
		this.id = this.props.id;
		console.log(this.props);
	}
	render() {
		return <h1>asd</h1>;
	}
}
function WithNavigate(props) {
	let navigate = useNavigate();
	return <Timer {...props} navigate={navigate} />;
}

export default WithNavigate;
