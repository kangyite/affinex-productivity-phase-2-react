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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useFakeMutation = () => {
	return React.useCallback(
		(obj) =>
			new Promise((resolve, reject) => {
				setTimeout(() => {
					if(["projectNum","batchNum","pcbModel","remark1","remark2","remark3","remark4"].includes(obj.data)) resolve({...obj});
					else if (obj.value.length === 0 && ["timer_set","plan","actual","enable_ot","ot_time","working_time","target"].includes.obj.data) {
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
	const [reset, setReset] = React.useState(false);
	
	const nameRef = useRef("");
	const handleClickEditName = () => {
		setEditName(true);
	};
	const handleClickReset = () => {
		setReset(true);
	};
	const [open, setOpen] = React.useState(false);
	const handleOpenSnack = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setEditName(false);
		setReset(false);
	};
	const handleSubmitName = () => {
		setTimerData({ ...timerData, name: nameRef.current.value });

		setEditName(false);
	};
	const handleReset = () => {
		setTimerData({ ...timerData, projectNum: "", batchNum:"",pcbModel:"", remark1:"", remark2:"",remark3:"",process:""});
		
		setReset(false);
	};
	const handleProcessChange = (event) => {
		setTimerData({...timerData, process: event.target.value});
	  };

	useEffect(() => {
		if (timerData.id !== undefined)
			set(ref(db, `devices/TIMER_${timerData.id}/data`), {
				...timerData,
			});

		// eslint-disable-next-line
	}, [timerData]);

	const handleCloseSnack = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
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
		{
			field: "data_name",
			headerName: "Data",
			width: 150,
			sortable: false,
			renderHeader: () => <strong>{"Data"}</strong>,
		},
		{
			field: "value",
			headerName: "Value",
			width: 400,
			sortable: false,
			editable: true,
			renderHeader: () => <strong>{"Value"}</strong>,
			valueGetter: (params) => {
				if (params.row.data !== "enable_ot") {
					return params.value;
				}
				return params.value ? "Yes" : "No";
			},
		},
	];
	const dataRow = [
		{ id: 0, data: "timer_set", data_name: "Timer Set", value: timerData.timer_set}, //prettier-ignore
		{ id: 1, data: "plan", data_name: "Plan	", value: timerData.plan },
		{ id: 2, data: "target", data_name: "Target", value: timerData.target },
		{ id: 3, data: "actual", data_name: "Actual", value: timerData.actual },
		{ id: 4, data: "working_time", data_name: "Working Time", value: timerData.working_time }, //prettier-ignore
		{ id: 5, data: "ot_time", data_name: "OT Time", value: timerData.ot_time }, //prettier-ignore
		{ id: 6, data: "enable_ot", data_name: "Enable OT", value: timerData.enable_ot, switch:true }, //prettier-ignore
	];
	
	const configCol = [
		{
			field: "config",
			headerName: "Config",
			width: 150,
			sortable: false,
			renderHeader: () => <strong>{"Config"}</strong>,
		},
		{
			field: "value",
			headerName: "Value",
			width: 400,
			sortable: false,
			editable: true,
			renderHeader: () => <strong>{"Value"}</strong>,
			renderCell: (params) => (
				<div >
				{params.row.data==="process"?
				(<FormControl fullWidth variant="standard" >
					<Select
					style={{"font-size":14}}
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={timerData.process||""}
					label="Age"
					displayEmpty
					disableUnderline
					defaultValue={{label:"Select",value:"asd"}}
					// defaultInputValue="defaultInputValue"
					onChange={handleProcessChange}
					>
						<MenuItem value={"Soldering"}>Soldering</MenuItem>
						<MenuItem value={"Cleaning"}>Cleaning</MenuItem>
						<MenuItem value={"Inspecting"}>Inspecting</MenuItem>
						<MenuItem value={"QC"}>QC</MenuItem>
						<MenuItem value={"Checking"}>Checking</MenuItem>
						<MenuItem value={"Assembling"}>Assembling</MenuItem>
					</Select>
				</FormControl>) : params.row.value
				}</div>
			)
		},
	];
	const configRow = [
		{ id: 0, data: "projectNum", config: "Project No.", value: timerData.projectNum||" "}, //prettier-ignore
		{ id: 1, data: "batchNum", config: "Batch No.", value: timerData.batchNum||" " },
		{ id: 2, data: "process", config: "Process", value: timerData.process||" "},
		{ id: 3, data: "pcbModel", config: "PCB Model", value: timerData.pcbModel||" "},
		{ id: 4, data: "remark1", config: "Remark 1", value: timerData.remark1||" " },
		{ id: 5, data: "remark2", config: "Remark 2", value: timerData.remark2||" " },
		{ id: 6, data: "remark3", config: "Remark 3", value: timerData.remark3||" " }, //prettier-ignore
		{ id: 7, data: "remark4", config: "Remark 4", value: timerData.remark4||" " }, //prettier-ignore
	];
	
	const mutateRow = useFakeMutation();

	const processRowUpdate = React.useCallback(
		async (newRow) => {
			// Make the HTTP request to save in the backend
			const response = await mutateRow(newRow);
			console.log(response);
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
						if (value[i] !== "-") return Promise.reject("Wrong format!");
					if ((i + 1) % 10 === 0)
						if (value[i] !== ",") return Promise.reject("Wrong format!");
				}
				if((value.match(/,/g)||[]).length !== (value.match(/-/g)||[]).length - 1) return Promise.reject("Wrong format!"); //prettier-ignore
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
				if (value.toLowerCase() === "yes") value = true;
				else if (value.toLowerCase() === "no") value = false;
				else return Promise.reject("Please write Yes/No");
			}
			
			update(ref(db, `/devices/TIMER_${timerData.id}/data`), {
				[data]: value,
			})
				.then(() => {
					setSnackbar({
						children: "Data successfully saved",
						severity: "success",
					});
				})
				.catch((error) => {
					setSnackbar({
						children: String(error),
						severity: "error",
					});
				});
			setTimerData({ ...timerData, [data]: value });

			// console.log(timerData);
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
				<Stack direction="row" spacing = {60}>
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
				<Button variant="outlined" onClick={handleClickReset}>
					Reset Config
				</Button>
				<Dialog open={reset} onClose={handleClose}>
					<DialogTitle>Are you sure to reset config?</DialogTitle>
					<DialogActions>
						<Button onClick={handleClose}>No</Button>
						<Button onClick={handleReset}>Yes</Button>
					</DialogActions>
				</Dialog>
				</Stack>
				
				<div
					style={{
						height: "422px",
						width: "100%",
						paddingTop: "25px",
						paddingBottom: "25px",
					}}
				>
					<Stack direction="row" spacing={2}>
						<DataGrid
							rows={dataRow}
							columns={dataCol}
							initialState={{
								pagination: {
									paginationModel: {
										pageSize: 20,
									},
									sorting: {
										sortModel: [{ field: "id", sort: "asc" }],
									},
								},
							}}
							disableRowSelectionOnClick
							disableColumnMenu
							hideFooter
							hideFooterSelectedRowCount
							isCellEditable={(params) =>
								!["actual", "target"].includes(params.row.data)
							}
							processRowUpdate={processRowUpdate}
							onProcessRowUpdateError={handleProcessRowUpdateError}
						/>
							<DataGrid
							rows={configRow}
							columns={configCol}
							initialState={{
								pagination: {
									paginationModel: {
										pageSize: 20,
									},
									sorting: {
										sortModel: [{ field: "id", sort: "asc" }],
									},
								},
							}}
							disableRowSelectionOnClick
							disableColumnMenu
							hideFooter
							hideFooterSelectedRowCount
							
							processRowUpdate={processRowUpdate}
							onProcessRowUpdateError={handleProcessRowUpdateError}
						/> 
					</Stack>
					
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

				<Stack direction="row" spacing={2}>
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
