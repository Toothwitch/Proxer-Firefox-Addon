var { ToggleButton } = require('sdk/ui/button/toggle');
var { setInterval } = require("sdk/timers");
var Request = require("sdk/request").Request;
var {XMLHttpRequest} = require("sdk/net/xhr");
var panels = require("sdk/panel");
var self = require("sdk/self");
var loggedIn = false;
var altPN = 0;
var newPN = 0;
var friends = 0;
var news = 0;
var other = 0;

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png"
  },
  badge: "",
  badgeColor: "#212121",
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  contentScriptFile: self.data.url("bg.js"),
  onHide: handleHide
});



function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

function checkLogin(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://proxer.me/login?format=json&action=login", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var resp = JSON.parse(xhr.responseText);
			console.log(xhr.responseText);
			if(resp.error == 0){
				loggedIn = true;
			}else{
				loggedIn = false;
				console.log("Not logged in...");
			}
		}
	}
	xhr.send();
	

}

function doLogin(){
	Request({
	url: "https://proxer.me/login?format=json&action=login",
	content: { username: 'username', password : 'password' },
	onComplete: function (response) {
		console.log( response.text );
		var resp = JSON.parse(response.text);
		if(resp.error == 0){
			loggedIn = true;
		}else{
			loggedIn = false;
			console.log("Not logged in...");
		}
		getNotifications();
	}
	}).post();
}

function getNotifications(){
	if(loggedIn == true){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://proxer.me/notifications?format=raw&s=count", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = xhr.responseText.split('#');
				if(resp[0]==0){
					//erfolgreich
					altPN = resp[1];
					newPN = resp[2];
					friends = resp[3];
					news = resp[4];
					other = resp[5];
					var count = 0;
					count += parseInt(altPN);
					count+= parseInt(newPN);
					count+= parseInt(friends);
					count+= parseInt(news);
					count+= parseInt(other);
					var out = "";
					out += count;
					//chrome.browserAction.setBadgeText({
					//	text: out
					//});
					//chrome.browserAction.setBadgeBackgroundColor({color: "#212121"});
					button.badge = out;
				}else{
					//failed
					console.log("failed");
				}
			}
		}
		xhr.send();
	}else{
		//nicht eingeloggt...
	}
}

doLogin();
//setInterval(function(){panel.port.emit("test", info);}, 10000);