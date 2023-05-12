import React, { useEffect, useState } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const Home = () => {
	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});
	const [open, setOpen] = React.useState(false);
	const handleOpenSnack = () => {
		setOpen(true);
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const [checked, setChecked] = React.useState(false);

	const handleChangeChecked = (event) => {
		setChecked(event.target.checked);
	};

	const navigate = useNavigate();
	const [timerData, setTimerData] = useState([]);
	const [timerIds, setTimerIds] = useState([]);
	useEffect(() => {
		document.title = "Home";
		const query = ref(db, "devices");
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerData = [];
				let timerIds = [];
				setTimerIds([]);
				const snapshotData = snapshot.val();
				for (let sid in snapshotData) {
					timerData.push({ sid: sid, ...snapshotData[sid].data });
					timerIds.push(sid);
				}
				setTimerData(timerData);
				setTimerIds(timerIds);
			}
		});
	}, []);

	return (
		<div className="page">
			<div className="page_title_container">
				<h1>Overview</h1>
			</div>
			<Stack direction="row" spacing={2}>
				<Button
					variant="contained"
					style={{ width: "150px", fontSize: "90%" }}
					color="success"
					onClick={() => {
						for (let timerId in timerIds) {
							update(ref(db, `/devices/${timerIds[timerId]}/data`), {
								forceupdate: true,
							});
						}

						handleOpenSnack();
					}}
				>
					Get Live Data
				</Button>
				<Snackbar
					open={open}
					autoHideDuration={6000}
					onClose={handleCloseSnack}
				>
					<Alert
						onClose={handleCloseSnack}
						severity="success"
						sx={{ width: "100%" }}
					>
						Updating...
					</Alert>
				</Snackbar>
				<FormControlLabel
					control={
						<Checkbox
							size="medium"
							checked={checked}
							onChange={handleChangeChecked}
						/>
					}
					label="Show offline timers"
				/>
			</Stack>

			<div className="overview_container">
				{timerData.map((timer) => {
					return checked | timer.online ? (
						<div
							className={timer.online === true ? "info_card" : " error_card"}
							key={timer.id}
							onClick={(e) => navigate("/timer/TIMER_" + timer.id)}
						>
							<h4>{timer.name ? timer.name : `TIMER_${timer.id}`}</h4>
							<div className="data_container">
								<div className="data_box">
									<div className="numerical_data">Plan: {timer.plan}</div>
									<div className="numerical_data">Target: {timer.target}</div>
									<div className="numerical_data">Actual: {timer.actual}</div>
								</div>
							</div>
							<div className="firmware_text">SN: TIMER_{timer.id}</div>
						</div>
					) : (
						<></>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
