const LineNotify = require("./src/client");

const ACCESS_TOKEN = "evbgdqbY8Blbi5KXy7eBLe7Q867QqqBMVGqsO3VMH8a";
const notify = new LineNotify(`${ACCESS_TOKEN}`);

notify.sendText("Halo pam");
notify.sendImage("https://s3-ap-southeast-1.amazonaws.com/media.storylog/storycontent/573467d33d3c23be21b37172/14632806394689764789.jpg");
notify.sendImage("Capture.jpg");
notify.sendSticker(13, 1);

//notify.status()
//notify.revoke()