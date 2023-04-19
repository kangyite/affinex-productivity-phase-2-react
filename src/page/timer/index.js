import React, { useEffect, useState, useRef } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref, set } from "firebase/database";

import Editable from "../../components/Editable";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
let changed = false;
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Timer = () => {
	const inputRef = useRef();
	const [openSnack, setOpenSnack] = React.useState(false);
	const [timerData, setTimerData] = useState({
		actual: 0,
		timer_set: 0,
		enable_ot: false,
		name: "",
		online: false,
		ot_time: "",
		plan: 0,
		target: 0,
		working_time: "",
	});
	const [editName, setEditName] = React.useState(false);
	const nameRef = useRef("");
	const handleClickEditName = () => {
		setEditName(true);
	};

	const handleClose = () => {
		setEditName(false);
	};
	const handleSubmitName = () => {
		setTimerData({ ...timerData, name: nameRef.current.value });

		setEditName(false);
	};
	useEffect(() => {
		if (timerData.id !== undefined)
			set(ref(db, `devices/TIMER_${timerData.id}/data`), {
				...timerData,
			});

		// eslint-disable-next-line
	}, [timerData.name]);
	const handleOTChange = (e) => {
		setTimerData({
			...timerData,
			[e.target.name]: e.target.checked,
		});
		changed = true;
	};
	const changeHandler = (e) => {
		setTimerData({
			...timerData,
			[e.target.name]:
				e.target.type === "number" ? Number(e.target.value) : e.target.value,
		});
		changed = true;
		console.log(timerData);
	};
	const handleUpdate = () => {
		set(ref(db, `devices/TIMER_${timerData.id}/data`), {
			...timerData,
		})
			.then(() => {
				setOpenSnack(true);
			})
			.catch((error) => {
				// The write failed...
			});
		changed = false;
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnack(false);
	};
	useEffect(() => {
		const path = window.location.pathname;
		const timerId = path.substring(path.lastIndexOf("/") + 1, path.length);

		document.title = timerId;

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
		// eslint-disable-next-line
	}, []);
	return (
		<div className="page">
			<div className={"page_title_container"}>
				<h1>{timerData.name ? timerData.name : `TIMER_${timerData.id}`}</h1>
				<div className="subtext">TIMER_{timerData.id}</div>
				<Button variant="outlined" onClick={handleClickEditName}>
					Edit Name
				</Button>
				<Dialog open={editName} onClose={handleClose}>
					<DialogTitle>Change Name</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Name"
							type="text"
							fullWidth
							variant="standard"
							inputRef={nameRef}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={handleSubmitName}>Submit</Button>
					</DialogActions>
				</Dialog>
				<div className="data_title_container">
					<h4>Timer Set: </h4>
					<Editable
						text={timerData.timer_set}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="number"
							name="timer_set"
							placeholder="Write a value"
							value={timerData.timer_set}
							onChange={changeHandler}
						/>
					</Editable>
				</div>
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
				<div className="data_title_container">
					<h4>Target: </h4>
					<Editable
						text={timerData.target}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="number"
							name="target"
							placeholder="Write a value"
							value={timerData.target}
							onChange={changeHandler}
						/>
					</Editable>
				</div>
				<div className="data_title_container">
					<h4>Actual: </h4>
					<Editable
						text={timerData.actual}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="number"
							name="actual"
							placeholder="Write a value"
							value={timerData.actual}
							onChange={changeHandler}
						/>
					</Editable>
				</div>
				<div className="data_title_container">
					<h4>Working Time: </h4>
					<Editable
						text={timerData.working_time}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="text"
							name="working_time"
							placeholder="Write a value"
							value={timerData.working_time}
							onChange={changeHandler}
						/>
					</Editable>
				</div>
				<div className="data_title_container">
					<h4>OT Time: </h4>
					<Editable
						text={timerData.ot_time}
						placeholder="Write a value"
						childRef={inputRef}
						type="input"
					>
						<input
							ref={inputRef}
							type="text"
							name="ot_time"
							placeholder="Write a value"
							value={timerData.ot_time}
							onChange={changeHandler}
						/>
					</Editable>
				</div>

				<div className="data_title_container">
					<h4>Enable OT: </h4>
					<Switch
						checked={timerData.enable_ot}
						name="enable_ot"
						onChange={handleOTChange}
						inputProps={{ "aria-label": "controlled" }}
					/>
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
				<p>Data will be updated once a minute</p>
				<br></br>
				<p>
					Make sure the time data is in a correct format e.g.
					0830-1300,1400-1530,1540-1800
				</p>
				<p>means working from 8.30am-1.00pm, 2.00pm-3.30pm, 3.40pm-6.00pm</p>
			</div>
		</div>
	);
};

export default Timer;
