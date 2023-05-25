import React, { useEffect, useState, useRef } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref, set, update } from "firebase/database";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
let changed = false;
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useFakeMutation = () => {
	return React.useCallback(
		(obj) =>
			new Promise((resolve, reject) => {
				setTimeout(() => {
					if (obj.value.length === 0) {
						reject(new Error("Error while saving, value can't be empty."));
					} else {
						resolve({ ...obj });
					}
				}, 200);
			}),
		[]
	);
};

const Timer = () => {
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
	const [open, setOpen] = React.useState(false);
	const handleOpenSnack = () => {
		setOpen(true);
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
		setOpen(false);
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

	const dataCol = [
		{ field: "data_name", headerName: "Data", width: 150, sortable: false },
		{
			field: "value",
			headerName: "Value",
			width: 400,
			sortable: false,
			editable: true,
		},
	];
	const dataRow = [
		{ id: 0, data: "timer_set", data_name: "Timer Set", value: timerData.timer_set}, //prettier-ignore
		{ id: 1, data: "plan", data_name: "Plan	", value: timerData.plan },
		{ id: 2, data: "target", data_name: "Target", value: timerData.target },
		{ id: 3, data: "actual", data_name: "Actual", value: timerData.actual },
		{ id: 4, data: "working_time", data_name: "Working Time", value: timerData.working_time }, //prettier-ignore
		{ id: 5, data: "ot_time", data_name: "OT Time", value: timerData.ot_time }, //prettier-ignore
		{ id: 6, data: "enable_ot", data_name: "Enable OT", value: timerData.enable_ot }, //prettier-ignore
	];
	const mutateRow = useFakeMutation();

	const processRowUpdate = React.useCallback(
		async (newRow) => {
			// Make the HTTP request to save in the backend
			const response = await mutateRow(newRow);
			let data = String(response.data);
			let value = response.value;
			if (
				data === "timer_set" ||
				data === "plan" ||
				data === "target" ||
				data === "actual"
			) {
				value = Number(value);
				if (value >= 10000 || value < 0) {
					return Promise.reject("Data out of range.");
				}
			} else if (data === "working_time" || data === "ot_time") {
				for (let i = 0; i < value.length; i++) {
					if ((i + 6) % 10 === 0)
						if (value[i] !== "-") return Promise.reject("3Wrong format!");
					if ((i + 1) % 10 === 0)
						if (value[i] !== ",") return Promise.reject("2Wrong format!");
				}
				if((value.match(/,/g)||[]).length !== (value.match(/-/g)||[]).length - 1) return Promise.reject("1Wrong format!"); //prettier-ignore
				let temp = value.split(",");
				for (let i in temp) {
					let fT = temp[i].split("-");
					if (fT[0] > fT[1]) return Promise.reject("Wrong format!");
					if (fT[0].substring(0, 2) < 0 || fT[0].substring(2, 4) > 59)
						return Promise.reject("Wrong format!");
					if (fT[1].substring(0, 2) < 0 || fT[1].substring(2, 4) > 59)
						return Promise.reject("Wrong format!");
				}
			} else if (data === "enable_ot") {
				if (value === "true") value = true;
				else if (value === "false") value = false;
				else return Promise.reject("Please write true/false");
			}

			setTimerData({ ...timerData, [data]: value });
			return response;
		},
		[mutateRow, timerData]
	);
	const handleProcessRowUpdateError = React.useCallback((error) => {
		setSnackbar({ children: error.message || error, severity: "error" });
	}, []);
	const [snackbar, setSnackbar] = React.useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);
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
				<div style={{ height: "422px", width: "100%", paddingTop: "25px" }}>
					<DataGrid
						rows={dataRow}
						columns={dataCol}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 10,
								},
								sorting: {
									sortModel: [{ field: "id", sort: "asc" }],
								},
							},
						}}
						pageSizeOptions={[1, 2]}
						disableRowSelectionOnClick
						disableColumnMenu
						autoPageSize
						hideFooter
						hideFooterSelectedRowCount
						isCellEditable={(params) =>
							!["actual", "target"].includes(params.row.data)
						}
						processRowUpdate={processRowUpdate}
						onProcessRowUpdateError={handleProcessRowUpdateError}
					/>
					{!!snackbar && (
						<Snackbar
							open
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							onClose={handleCloseSnackbar}
							autoHideDuration={6000}
						>
							<Alert {...snackbar} onClose={handleCloseSnackbar} />
						</Snackbar>
					)}
				</div>

				<p>
					{changed
						? "Kindly press the Update button for updating database."
						: ""}
				</p>
				<Stack direction="row" spacing={2}>
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
					<Button
						variant="contained"
						style={{ width: "150px", fontSize: "90%" }}
						color="success"
						onClick={() => {
							update(ref(db, `/devices/TIMER_${timerData.id}/data`), {
								forceupdate: true,
							});
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
				</Stack>

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
