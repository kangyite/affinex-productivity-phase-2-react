import React, { useEffect, useState } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref, update } from "firebase/database";

import Stack from "@mui/material/Stack";
import { Chart } from "react-google-charts";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { ExportToCsv } from "export-to-csv-fix-source-map";

function Data() {
	const [graphData, setGraphData] = useState([]);
	const [csvData, setcsvData] = useState([]);
	const [date, setDate] = useState([]);
	const [timerId, setTimerId] = React.useState("");
	const [dateList, setDateList] = useState([]);
	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});
	const handleChange = (event) => {
		setTimerId(event.target.value);
	};
	const [timerIds, setTimerIds] = useState([]);
	const isNotAvailable = (date) => {
		const day = String(date.$D);
		const month = String(date.$M + 1);
		const year = String(date.$y);

		for (let i in dateList) {
			if (
				dateList[i][0] === day &&
				dateList[i][1] === month &&
				dateList[i][2] === year
			)
				return false;
		}
		return true;
	};
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
	useEffect(() => {
		document.title = "Data Explorer";
		const query = ref(db, `devices`);
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerIds = [];
				const snapshotData = snapshot.val();
				timerIds = snapshotData;
				setTimerIds(Object.keys(timerIds));
			}
		});

		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (timerId === "") return;
		const q = ref(db, `devices/${timerId}/data_logger/`);
		onValue(q, (snapshot) => {
			if (snapshot.exists()) {
				const snapshotData = snapshot.val();
				var tempDate = [];
				for (let d in snapshotData) {
					tempDate.push(d.split("-"));
				}
				setDateList(tempDate);
			}
		});
		if (date === []) return;
		let dateS = `${date.$D}-${date.$M + 1}-${date.$y}`;
		const query = ref(db, `devices/${timerId}/data_logger/${dateS}`);
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerData = [];
				const snapshotData = snapshot.val();
				timerData = snapshotData;
				let graphData = [["Time", "Target", "Actual"]];

				for (let unix in timerData) {
					let _date = new Date(unix * 1000);
					if (timerData[unix].actual === 0 && !checked)
						graphData = [["Time", "Target", "Actual"]];
					graphData.push([
						// String(_date.getHours()) + String(_date.getMinutes()),
						_date.toTimeString().substring(0, 5),
						timerData[unix].target,
						timerData[unix].actual,
					]);
				}
				console.log(graphData);
				setGraphData(graphData);
				setcsvData(graphData);
			} else setGraphData([]);
		});
	}, [timerId, date, checked]);
	return (
		<div className="page">
			<Stack spacing={2}>
				<Stack direction="row" spacing={2}>
					<FormControl sx={{ minWidth: 80 }}>
						<InputLabel id="demo-simple-select-label">Timer</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={timerId}
							label="Timer"
							onChange={handleChange}
						>
							{timerIds.map((id) => (
								<MenuItem value={id} key={id}>
									{id}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<LocalizationProvider
						dateAdapter={AdapterDayjs}
						className="pickerDiv"
					>
						<DatePicker
							value={date}
							shouldDisableDate={isNotAvailable}
							onChange={(newValue) => setDate(newValue)}
						/>
					</LocalizationProvider>
					<FormControlLabel
						control={
							<Checkbox
								size="medium"
								checked={checked}
								onChange={handleChangeChecked}
							/>
						}
						label="Show data before reset"
					/>
				</Stack>

				<div className="page">
					{graphData.length === 0 ? (
						<h2>No data found</h2>
					) : (
						<>
							<Chart
								chartType="Line"
								data={graphData}
								options={{
									width: 1000,
									height: 600,
									chart: {
										title: "Plan",
									},
								}}
							/>
							<Stack direction="row" spacing={2}>
								<Button
									variant="contained"
									endIcon={<DownloadIcon />}
									style={{ width: "150px", fontSize: "90%" }}
									onClick={() => {
										const fileName = `Affinex Productivity Timer Phase 2 - ${
											date.$D
										}-${date.$M + 1}-${date.$y} ${timerId}`;
										const options = {
											fieldSeparator: ",",
											quoteStrings: '"',
											decimalSeparator: ".",
											showLabels: true,
											showTitle: true,
											title: fileName,
											filename: fileName,
											useTextFile: false,
											useBom: true,
										};

										const csvExporter = new ExportToCsv(options);
										csvExporter.generateCsv(csvData);
									}}
								>
									Export CSV
								</Button>
								<Button
									variant="contained"
									style={{ width: "150px", fontSize: "90%" }}
									color="success"
									onClick={() => {
										update(ref(db, `/devices/${timerId}/data`), {
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
						</>
					)}
				</div>
			</Stack>
		</div>
	);
}

export default Data;
