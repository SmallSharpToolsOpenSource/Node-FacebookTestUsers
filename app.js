
var request = require('request');
var querystring = require('querystring');
var names = require('./names');

// https://developers.facebook.com/tools/explorer/
// Get your AppID and App Access Token from the Graph API Explorer. (link above)
// Select the app and click Get Token and select Get App Token.
// Ue the App Access Token here. The App ID is in the URL and
// on the dashboard page for the app.

var appId = 'CHANGE';
var appAccessToken = 'CHANGE';

var createUser = function (callback) {
  if (!callback) { return; }
  
  var name = names.generateRandomName();

  var permissions = 'email,user_birthday';
  
  var params = {
    'access_token': appAccessToken,
    'name': name,
    'permissions': permissions,
    'installed': 'false'
  };
  
  var query = querystring.stringify(params);
  
  var request_options = {
    url: 'https://graph.facebook.com/v2.3/' + appId + '/accounts/test-users?' + query,
    method: 'POST'
  };

  request(request_options, function (error, response, body) {
    if (error) {
      console.log(error);
      if (callback) {
        callback(null, error);
      }

    }
    else {
      var json = JSON.parse(body);
      if (json) {
        json.name = name;
        if (callback) {
          callback(json, null);
        }

      }
      else {
        if (callback) {
          console.log('Body:');
          console.log(body);
          callback(null, 'Failure to parse json response body: ' + body);
        }
      }
    }
  });
};

var i = 0; var users = [];

var createNextUser = function(user, error) {
  if (error || !user) {
    // something went wrong (stop)
    console.log('Unable to continue due to an error');
    if (error) {
      console.log(error);
    }
    else if (!user) {
      console.log('Failure to create test user');
    }
  }
  else if (user) {
    users.push(user);
  }
  else {
    // something went wrong (stop)
    console.log('Unable to continue due to an error');
  }
  
  i++;

  if (i < 10) {
    createUser(createNextUser);
  }
  else {
    for (var index in users) {
      var u = users[index];
      console.log('id: ' + u.id);
      console.log('name: ' + u.name);
      console.log('email: ' + u.email);
      console.log('password: ' + u.password);
      console.log('');
    }
  }
};

createUser(createNextUser);
