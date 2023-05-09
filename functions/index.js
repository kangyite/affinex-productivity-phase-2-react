const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
let db = admin.database();
exports.scheduledDeleteLoggedData = functions.pubsub
	.schedule("every day 00:00")
	.onRun(async (context) => {
		let ref = db.ref("devices");
		ref.on(
			"value",
			function (snapshot) {
				let snapshotData = snapshot.val();
				let currentTime = new Date().getTime();
				for (let sid in snapshotData) {
					let loggedData = snapshotData[sid].data_logger;
					for (let dataLogDate in loggedData) {
						let splitedDate = dataLogDate.split("-");

						let realDataLogDate = new Date(
							splitedDate[2],
							splitedDate[1] - 1,
							splitedDate[0]
						).getTime();

						if (currentTime - realDataLogDate > 1000 * 60 * 60 * 24 * 30) {
							const tasksRef = db.ref(
								`devices/${sid}/data_logger/${dataLogDate}`
							);
							console.log(`devices/${sid}/data_logger/${dataLogDate}`);
							console.log("location removed to save space");
							tasksRef.remove();
						}
					}
				}
			},
			function (error) {
				console.log("Error: " + error.code);
			}
		);
	});

exports.scheduledCheckOnlineStatus = functions.pubsub
	.schedule("every 5 minutes")
	.onRun(async (context) => {
		let ref = db.ref("devices");
		let rtdbUpdates = {};
		ref.on(
			"value",
			function (snapshot) {
				let snapshotData = snapshot.val();
				let currentTime = new Date().getTime();
				for (let sid in snapshotData) {
					let unix = snapshotData[sid].data.lastupdate;
					let onlineStatus = currentTime - unix * 1000 < 5 * 60 * 1000;
					rtdbUpdates[`${sid}/data/online`] = onlineStatus;
				}
				return db.ref("devices").update(rtdbUpdates);
			},
			function (error) {
				console.log("Error: " + error.code);
			}
		);
	});
