const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
let db = admin.database();
exports.scheduledDeleteLoggedData = functions.pubsub
	.schedule("every 1 day")
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
