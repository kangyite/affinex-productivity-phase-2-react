import React, { useEffect, useState } from "react";
import {} from "./style.css";
import { db } from "../../firebase";
import { onValue, ref } from "firebase/database";

import Stack from "@mui/material/Stack";
import { Chart } from "react-google-charts";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
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

	const handleChange = (event) => {
		setTimerId(event.target.value);
	};
	const [timerIds, setTimerIds] = useState([]);
	useEffect(() => {
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
		let dateS = `${date.$D}-${date.$M + 1}-${date.$y}`;
		const query = ref(db, `devices/${timerId}/data_logger/${dateS}`);
		onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let timerData = [];
				const snapshotData = snapshot.val();
				timerData = snapshotData;
				let graphData = [["Time", "Target", "Actual"]];
				for (let unix in timerData) {
					graphData.push([
						new Date(unix * 1000),
						timerData[unix].target,
						timerData[unix].actual,
					]);
				}
				setGraphData(graphData);
				let csvData = [["Unix", "Target", "Actual"]];
				for (let unix in timerData) {
					csvData.push([unix, timerData[unix].target, timerData[unix].actual]);
				}
				setcsvData(csvData);
			} else setGraphData([]);
		});
	}, [timerId, date]);
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
							onChange={(newValue) => setDate(newValue)}
						/>
					</LocalizationProvider>
				</Stack>

				<div className="page">
					{graphData.length === 0 ? (
						<h2>No data found</h2>
					) : (
						<>
							<Chart
								chartType="Line"
								width="1000px"
								height="400px"
								data={graphData}
							/>
							<Button
								variant="contained"
								endIcon={<DownloadIcon />}
								style={{ width: "150px", fontSize: "90%" }}
								onClick={() => {
									const fileName = `Affinex Productivity Timer Phase 2 ${
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
						</>
					)}
				</div>
			</Stack>
		</div>
	);
}

export default Data;
