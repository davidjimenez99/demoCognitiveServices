const { json } = require('body-parser');
const express = require('express');
const request = require('request');
const cors = require('cors')
const app = express();


app.get('/getEmotions', (req, res) => {


    console.log(req.query.url)

    requestAzure(res, req.query.url);


});



app.listen(3000, () => console.log('Listening on port 3000'));

function requestAzure(Response, url){

    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age, gender, emotion'
    };
    
    const options = {
        uri: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect',
        qs: params,
        body: '{"url":"' + url + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '15c45045ebb247f8853f55a9d8e5b745'
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error:', error)
            return;
        }
    
        let jsonEmotion = JSON.parse(body)[0].faceAttributes.emotion
    
    
        var map = {}

        var percentage = []

        for (var i in jsonEmotion){
            if (jsonEmotion[i] != 0){
                map[jsonEmotion[i]] = i
                percentage.push(parseFloat(jsonEmotion[i]))
            }
                
        }

        percentage = percentage.reverse()

        let data = []

        for (var i in percentage){
            data.push(map[percentage[i]])
        }

        console.log(data)


        Response.setHeader('Access-Control-Allow-Origin', '*');
        Response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        Response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        Response.setHeader('Access-Control-Allow-Credentials', true);
    
        Response.send(data)

    
    });



}


