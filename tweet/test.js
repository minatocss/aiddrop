var express = require("express");
var bodyParser = require('body-parser');
var https = require('follow-redirects').https;
var fs = require('fs');

const cors = require('cors');
const { DefaultSerializer } = require("v8");


var app = express();
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/aroundtheworld', jsonParser, async (request, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://www.aiddrop.io");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    data = await request.body

    var postData = JSON.stringify({ "data": { "email": data['world'] } });

    var options = {
        hostname: 'api.apispreadsheets.com',
        method: 'POST',
        path: '/data/GyRSbYJS17TzJO9K',
        headers: {
            "accessKey": "7cb9df69d234d560a0194ede8741083a",
            "secretKey": "ac3e92feccaedf214b039ab28737afb8",
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };
    var req = https.request(options, function (res) {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    })
    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();

    return 'Success'
})

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
            'Content-Type': 'application/json',
            'Authorization': 'OAuth oauth_consumer_key="JIeJbrZn8EDWV9XEADRnehdHz",oauth_token="1380785265250291713-DXIyXEjQURXrXb0i1nKaBRIcz3gyiC",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1685711669",oauth_nonce="6gqPrTDxak1",oauth_version="1.0",oauth_signature="O7CqFtOejoaGHpqmZ9vPfJIH9pA%3D"',
            'Cookie': 'guest_id=v1%3A168339493226125481'
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
    for (var i = JSON.parse(sheet_data)['data'].length - 1; i >= 0; i--) {
        console.log(JSON.stringify(Object.values(data)[5]))
        console.log(JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[5]))
        if (JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[5]) == JSON.stringify(Object.values(data)[5]) && JSON.stringify(Object.values(JSON.parse(sheet_data)['data'][i])[8]) == 0) {
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
