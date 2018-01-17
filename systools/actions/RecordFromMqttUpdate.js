var moment = require('moment')
moment = moment().format('YYYY-MM-DDTHH:mm:ss\\Z')

var mqtt = require('mqtt')
var jsonfile = require('jsonfile')
var mqttTopic, mqttServer;
var _ = require('lodash');

var configFile = "../../config/config.json";
var dataStorage = "../../log/datastorage.json";
var client;

jsonfile.spaces = 4;

jsonfile.readFile(configFile, function(err, obj) {
	if (err) throw err;

	mqttTopic = obj.system.mqttTopic + '/update';
	console.log("Result parse config.json : " + mqttTopic);
	mqttServer = obj.system.mqttServer;
	console.log("Result parse config.json : " + mqttServer);
	client = mqtt.connect('mqtt://10.3.141.1');

	client.on('connect', function () {
	console.log("mqttTopic : " + mqttTopic);
	    client.subscribe(mqttTopic)
	    console.log("connect to topic ")
	    jsonfile.writeFile(dataStorage,"Beginning Tracking --- "+ moment, function(err) { if (err) throw err});
	})

	var objJSON = {};

	client.on('message', function (topic, message) {
		var jsonCool = JSON.parse(message.toString());
		//JSON Analyse 
		for(var exKey in jsonCool.state.reported) {
			_.set(objJSON, "state.reported."+exKey, jsonCool.state.reported[exKey])
		}

		writeFile(objJSON);
	})
})

function writeFile(objJSON) {
		console.log('Writing file.... ');
		jsonfile.writeFile(dataStorage,objJSON["state"],{flag: 'a'}, function(err) { if (err) throw err});
		console.log('file saved...');	
	}