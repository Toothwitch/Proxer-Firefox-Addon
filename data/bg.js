self.port.on("test", function(info) {
  document.getElementById("content").innerHTML += info;
});



function doLogin(){
	Request({
	url: "https://proxer.me/login?format=json&action=login",
	content: { username: 'Toothwitch', password : 'Zumka22wrew45tz' },
	onComplete: function (response) {
		console.log( response.text );
	}
	}).post();
}