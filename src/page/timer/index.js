import React, { useEffect, useState, useRef } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref, set } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";

import Editable from "../../components/Editable";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const path = window.location.pathname;
const timerId = path.substring(path.lastIndexOf("/") + 1, path.length);
console.log(timerId);
let changed = false;
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Timer = () => {
	const inputRef = useRef();
	const [openSnack, setOpenSnack] = React.useState(false);
	const [timerData, setTimerData] = useState({
		actual: 0,
		enable_ot: 0,
		name: "",
		online: false,
		ot_time: "",
		plan: 0,
		target: 0,
		working_time: "",
	});
	const changeHandler = (e) => {
		setTimerData({ ...timerData, [e.target.name]: e.target.value });
		changed = true;
		console.log(changed);
	};
	const handleUpdate = () => {
		set(ref(db, `devices/TIMER_1/data`), {
			...timerData,
		})
			.then(() => {
				setOpenSnack(true);
			})
			.catch((error) => {
				// The write failed...
			});
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnack(false);
	};
	useEffect(() => {
		const query = ref(db, `devices/${timerId}`);
		console.log(`devices/${timerId}`);
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerData = [];
				const snapshotData = snapshot.val();
				timerData = snapshotData.data;

				// setTimerData(timerData);
				Object.keys(timerData).forEach((key) => {
					setTimerData({ ...timerData });
				});
			}
		});
	}, []);
	return (
		<div className="page">
			<div className={"page_title_container"}>
				<h1>{timerData.name || "Unnamed"} </h1>
				<div className="data_title_container">
					<h4>Plan: </h4>
					<Editable
						text={timerData.plan}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="number"
							name="plan"
							placeholder="Write a value"
							value={timerData.plan}
							onChange={changeHandler}
						/>
					</Editable>
				</div>
				<p>
					{changed
						? "Kindly press the Update button for updating database."
						: ""}
				</p>
				<Button variant="contained" onClick={handleUpdate}>
					Update
				</Button>
				<Snackbar
					open={openSnack}
					autoHideDuration={5000}
					onClose={handleCloseSnack}
				>
					<Alert
						onClose={handleCloseSnack}
						severity="success"
						sx={{ width: "100%" }}
					>
						Updated to Firebase!
					</Alert>
				</Snackbar>
			</div>
		</div>
	);
};

export default Timer;
