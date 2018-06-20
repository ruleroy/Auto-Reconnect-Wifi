const isOnline = require("is-online");
const wifi = require("node-wifi");
const robot = require("robotjs");

wifi.init({
	iface: "Wi-Fi"
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var connected = false;

async function demo() {
	await isOnline().then(async function (online) {
		if (online) {
			console.log(new Date().toUTCString() + " - Online");
			connected = true;
		} else {
			console.log(new Date().toUTCString() + " - Offline");
			console.log("Attempting to reconnect...");
			await wifi.disconnect(function(err) {
				if (err) {
					console.log(err);
				}
				console.log("Disconnected Wi-Fi");
				connected = false;
			});

			await sleep(1000);
			// Connect to a network
			wifi.connect(
				{ ssid: "@Marisa_Wifi_F3_2", password: "" },
				function(err) {
					if (err) {
						console.log(err);
					}
					console.log("Connected to @Marisa_Wifi_F3_2");
				}
			);

			await sleep(1000);
			var counter = 0;
			while(!connected){
				isOnline().then(async function (online) {
					if(online){
						robot.keyTap("w", "control");
						connected = true;
					}
				});
				console.log("Waiting for connection...");
				await sleep(5000);
				counter++;

				if(counter == 5){
					break;
				}
			}

		}
	});
	await sleep(5000);
	demo();
}

console.log("Auto Reconnect Shitty Wifi - Roy Vannakittikun");
console.log("Press CTRL+C to stop.");

demo();

