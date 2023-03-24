import React, { useEffect, useState } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
const Home = () => {
	const navigate = useNavigate();
	const [timerData, setTimerData] = useState([]);
	useEffect(() => {
		const query = ref(db, "devices");
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerData = [];
				const snapshotData = snapshot.val();
				for (let sid in snapshotData) {
					timerData.push({ sid: sid, ...snapshotData[sid].data });
				}
				setTimerData(timerData);
			}
		});
	}, []);

	return (
		<div className="page">
			<div className="page_title_container">
				<h1>Overview</h1>
			</div>
			<div className="overview_container">
				{timerData.map((timer) => {
					return (
						<div
							className={timer.online === true ? "info_card" : " error_card"}
							key={timer.id}
							onClick={(e) => navigate("/timer/TIMER_" + timer.id)}
						>
							<h4>TIMER_{timer.id}</h4>
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
};

export default Home;
