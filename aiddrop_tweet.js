var express = require("express");
const Twit = require('twit');
const axios = require('axios');

var app = express();

const T = new Twit({
    consumer_key: 'VsTiqCuAQeqLpZ6s5YAzTguvU',
    consumer_secret: 'vy8u1RCgXvbOSNBjN5Zl9vkE68LJAJWJiCgoYfzvKDyWpesVFg',
    access_token: '2173809991-25QLSrk5WrxhrkwtbIKDTDfaCjcUkWiztk2m66C',
    access_token_secret: 'kzcH9sLFvDhJ083GCjf32tSKQ5uhQsRmsEAS48y6plWG1',
});



const videoUrl = 'https://gateway.pinata.cloud/ipfs/QmdTHfASZDDHefaPN1intaQ8CkhohyGCGwyQwRjSBDV8FU/1.mp4';

axios({
    method: 'get',
    url: videoUrl,
    responseType: 'arraybuffer',
}).then(function (response) {
    T.post('media/upload', { media_data: response.data.toString('base64') }, function (err, data, response) {
        const mediaIdStr = data.media_id_string;
        const params = { status: 'Check out this cool video!', media_ids: [mediaIdStr] };

        T.post('statuses/update', params, function (err, data, response) {
            console.log(data);
        });
    });
});

app.post('/tweet', async (request, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://aiddrop.webflow.io");
    data = request.body
    if (data['Tweeted'] == 0) {
        const tweeter = data['Tweeter'] != "" ? "by @" + data['Tweeter'] : ""
        var text = "Wohhoo !! " + data['EthAmount'] + "eth donation " + tweeter + " went through for mission" + data['Mission'] // Wohhoo !! x eth donation by @xyz went through for mission y + video || daniel @ text input 
        data['Tweeted'] = 1
        const videoUrl = 'https://gateway.pinata.cloud/ipfs/QmdTHfASZDDHefaPN1intaQ8CkhohyGCGwyQwRjSBDV8FU/1.mp4';
        await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'arraybuffer',
        }).then(function (response) {
            T.post('media/upload', { media_data: response.data.toString('base64') }, function (err, data, response) {
                const mediaIdStr = data.media_id_string;
                const params = { status: text, media_ids: [mediaIdStr] };

                T.post('statuses/update', params, function (err, data, response) {
                    console.log(data);
                });
            });
        });
    } else {
        return 'Failed'
    }
    return 'Success'
})

app.listen(3000, () => {
    console.log("Server running on port:  http://localhost:3000/");
});

/*fetch("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/", {
	method: "POST",
	body: JSON.stringify({"data": {"Txn":"test","Date":"test","Txn":"test","Address":"test","Mission":"test","Tweeted":"1","Tweeter":"","EthAmount":'test',"ConversionRate":'test'}, "query": "SELECT * FROM 2gzcoSyeACuKfuAJ WHERE Tweeted = 0 AND Txn = 'test' "}),
}).then(res =>{
	if (res.status === 201){
		// SUCCESS
	}
	else{
		// ERROR
	}
})*/