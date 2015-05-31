self.port.on("content", function(info) {
  document.getElementById("content").innerHTML = info;
});


document.onkeydown = function(e){
	if(e.keyCode == 13){
			var username = document.getElementById("username").value;
			var pass = document.getElementById("pass").value;
			document.getElementById("content").innerHTML = "Processing...";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://proxer.me/login?format=json&action=login", true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					// JSON.parse does not evaluate the attacker's scripts.
					var resp = JSON.parse(xhr.responseText);
					if(resp.error == 0){
						document.getElementById("content").innerHTML = "Willkommen "+username.toString()+"!";
						self.port.emit("loggedIn", "");
					}else{
						document.getElementById("content").innerHTML = "Fehler";
					}
				}
			}
			var data = new FormData();
			data.append('username', username);
			data.append('password', pass);
			xhr.send(data);
	}else{
	}
}