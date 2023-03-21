import React, { Component } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
class Home extends Component {
	state = {
		timerData: [],
	};
	componentDidMount() {
		let timerData = [];
		const query = ref(db, "devices");
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				// const data = Object.values(snapshot.val());
				const snapshotData = snapshot.val();
				for (let id in snapshotData) {
					timerData.push({ id: id, ...snapshotData[id].data });
				}
			}
		});
		this.setState({
			timerData: timerData,
		});
		console.log(timerData);
	}
	render() {
		return (
			<div className="page">
				<div className="page_title_container">
					<h1>Overview</h1>
				</div>
				<div className="overview_container">
					{this.state.timerData.map((timer) => {
						return (
							<div
								className={timer.online === true ? "info_card" : " error_card"}
								key={timer.id}
								onClick={(e) => this.props.navigate("/timer/" + timer.id)}
							>
								<h4>{timer.name ? timer.name : `${timer.id} (ID)`}</h4>
								<div className="data_container">
									<div className="data_box">
										<div className="numerical_data">Plan: {timer.plan}</div>
										<div className="numerical_data">Target: {timer.target}</div>
										<div className="numerical_data">Actual: {timer.actual}</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
function WithNavigate(props) {
	let navigate = useNavigate();
	return <Home {...props} navigate={navigate} />;
}

export default WithNavigate;
