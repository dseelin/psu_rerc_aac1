var Alexa = require('alexa-sdk');
var google = require('googleapis');
var util = require('util');


var gmail = google.gmail('v1');

var OAuth2Client = google.auth.OAuth2;

var CLIENT_ID ='60424467687-tspm1lnu1quk7kd4svvufj3rusbq2c6t.apps.googleusercontent.com';
var CLIENT_SECRET = '2-Mp4UjgpQqel9bzxk5dDyiU';

//var CLIENT_REDIRECT = "https://layla.amazon.com/api/skill/link/MBYKUSTHWH1E2"
var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

var accessToken="";
var welcomeMessage = "Welcome to Gmail.";
var repeatWelcomeMessage = "Welcome to Gmail.";
var noAccessToken = "Could not connect to Gmail.";
var repeatNoAccessToken = "Could not connect to Gmail.";
var helpText = "Help menu."; // make this better
var stopSkillMessage = "Okay bye bye now!";


var Handler = {
	'NewSession': function() {
		
	
		accessToken = this.event.session.user.accessToken;
	
		if(accessToken) {
			//this.emit(':tell',welcomeMessage, repeatWelcomeMessage);


			//following block is format for a call, set json parameters
			//have function callback upon completion of request
			oauth2Client.setCredentials({access_token: accessToken});

			gmail.users.messages.list({
				userId: 'me',
				auth: oauth2Client,
				maxResults: 3,
				q: 'is:unread'
			}, function(err, response){
				console.log("error... : ", err);
				console.log("response...: ", response);
				//this.emit(':tell','are we even here');
			});
			
		}
		else
		{
			this.emit(':tell',noAccessToken, repeatNoAccessToken);
		}
		
	},
	'GetUnreadEmailCount': function(){
		var gmail = google.gmail('v1');
  		gmail.users.labels.list({
    	auth: oauth2Client,
    	userId: 'me',
  		}, function(err, response) {
    	if (err) {
      		console.log('The API returned an error: ' + err);
      		return;
    	}
    	var labels = response.labels;
    	if (labels.length == 0) {
      		console.log('No labels found.');
    	} else {
      		console.log('Labels:');
      		for (var i = 0; i < labels.length; i++) {
        		var label = labels[i];
        		console.log('- %s', label.name);
      		}
    	}
  		});
	},
	'ReadUnreadEmails': function(){
	},
	'GetUnreadEmailsOverview': function(){
	},
	'AMAZON.CancelIntent': function(){
		//triggered when user asks Alexa to cancel interaction
		this.emit(':tell', stopSkillMessage);
	},
	'AMAZON.StopIntent': function(){
		//triggered when user asks Alexa to stop interaction
		this.emit(':tell', stopSkillMessage);
	},
	'AMAZON.HelpIntent': function(){
		//triggered when user asks Alexa for help
		this.emit(':ask', helpText, helpText);
	},
	'Unhandled': function(){
		//triggered when no intent matches Alexa request 
		this.emit(':ask', helpText, helpText);
	}
}

//Add handlers
exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event,context);
	alexa.registerHandlers(Handler);
	alexa.execute();
}