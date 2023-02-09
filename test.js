var express = require("express");
var bodyParser = require('body-parser');
var https = require('follow-redirects').https;
var fs = require('fs');

const cors = require('cors');
const { DefaultSerializer } = require("v8");


var app = express();
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.post('/tweet', jsonParser, async (request, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://aiddrop.webflow.io");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    data = await request.body
    var options = {
        'method': 'POST',
        'hostname': 'api.twitter.com',
        'path': '/2/tweets',
        'headers': {
          'Authorization': 'OAuth oauth_consumer_key="A8ARxpGSo8GyDdWhEUdIpSjnX",oauth_token="2173809991-ABi37l3mofxSQEEGFEPXUEHAxiK5zhkbSOxG6wa",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1675865562",oauth_nonce="L0sy74OmClt",oauth_version="1.0",oauth_signature="lAoNetyawlfGnKfbiaTEr4ZA%2FYg%3D"',
          'Content-Type': 'application/json'
        },
        'maxRedirects': 20
      };
    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });
    let data_promise = new Promise((resolve, reject) => {
        https.request("https://api.apispreadsheets.com/data/2gzcoSyeACuKfuAJ/", function (response) {
            let chunks_of_data = [];
            response.on('data', function (chunk) {
                chunks_of_data.push(chunk);
            });

            response.on('end', function () {
                let response_body = Buffer.concat(chunks_of_data);
                resolve(response_body.toString());
            });
        }).end()
    });
    let sheet_data = await data_promise
    let check = false
    for(var i = JSON.parse(sheet_data)['data'].length - 1 ; i >= 0 ; i--){
        console.log(JSON.stringify(Object.values(data)[5]))
        console.log(JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[5]))
        if(JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[5]) == JSON.stringify(Object.values(data)[5]) && JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[8]) == 0){
            check = true
            break
        }
    }
    if (data['Tweeted'] == 0 && check) {
        const tweeter = data['Tweeter'] != "" ? "by " + data['Tweeter'] : ""
        var postData = JSON.stringify({
            "text": "Wohhoo !! " + data['EthAmount'] + " eth donation " + tweeter + " went through for mission " + data['Mission'] // Wohhoo !! x eth donation by @xyz went through for mission y + video || daniel @ text input 
        });
        req.write(postData);

        req.end();
        //SELECT * FROM 2gzcoSyeACuKfuAJ WHERE Tweeted = 0 and Txn = last_data['Txn']
    } else {
        res.send('Failed')
        return 'Failed'
    }
    res.send('Success')
    return 'Success'
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port:  http://localhost:3000/");
});
