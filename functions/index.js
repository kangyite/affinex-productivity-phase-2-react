const functions = require("firebase-functions");
const admin = require("firebase-admin");
let db = admin.database();

exports.scheduledDeleteLoggedData = functions.pubsub
	.schedule("every 1 minutes")
	.onRun(async (context) => {
		const query = db.ref(db, `devices/`);
		db.onValue(query, (snapshot) => {
			if (snapshot.exists()) {
				let currentTime = new Date().getTime();
				const snapshotData = snapshot.val();
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
								db,
								`devices/${sid}/data_logger/${dataLogDate}`
							);
							db.remove(tasksRef).then(() => {
								console.log("location removed to save space");
							});
						}
					}
				}
			}
		});
	});
