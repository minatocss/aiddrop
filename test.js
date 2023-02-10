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
    res.setHeader("Access-Control-Allow-Origin", "https://www.aiddrop.io");
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
          'Authorization': 'OAuth oauth_consumer_key="qGkXohl1IohZlTeH2vZlTb5ZY",oauth_token="1380785265250291713-dRplmIUidWuXAOu8Z1cNQI3xK2MbgB",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1676043377",oauth_nonce="7aNvn7I1wzv",oauth_version="1.0",oauth_signature="heQ%2FgvV6V92yJO6wG9XTwEprIHg%3D"',
          'Content-Type': 'application/json',
          'Cookie': 'guest_id=v1%3A166914611148828072'
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
    check = true
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
