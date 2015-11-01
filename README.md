#Express Mongoose Heroku Server
##Contents
* [Description](#Description)
* [Endpoints](#Endpoints)  
* [Postman](postman/)  
* [MongoDB - Database](models/)  
* [Data Sources - dummy-json Generation](data_templates/)  
* [Controllers](controllers/)  

##Description
* `http://localhost:3000`  (local)  
* `http://[app name here].herokuapp.com`  (remote)  
* `npm start`  
* `npm stop`  
* `npm test`  

## Endpoints  
| Methods | URI Endpoints | Params | Responds |
|--------:|:-------------:|:------:|:--------:|
| `/hostname` | `GET`, `POST`, `PUT`, `DELETE` | `/:NAME`, `/:ADDRESS`, `/:MESSAGE` | `body` `body.message` | `{response}` Entry |
| `/buildstatus` | `GET`, `POST` | `buildname`, `buildstatus` | SVG of build status, void |  

###hostname
Example usage with `client` and `server` actors  
```
<html>
…
<iframe id="test"></iframe>

<script>
(function (win, doc, undefined) {

	var xhr = new XMLHttpRequest();
	var iframe = doc.querySelector("#test");
	var interval = 3000;
	// "localhost" for local dev. Use a remote URI for actual application
	var baseUri = "http://localhost:3000";
	var endpoint = "/hostname/[yourAppName]";
	var uri = baseUri + endpoint;

	server();

	client();

	function client () {

		setTimeout(updateIframe, interval + 1000);
		xhr.open("GET", uri, true);
		xhr.onload = updateIframeContent;
		xhr.send();

		// Should definitely run GET at greater interval than
		// PUT. Otherwise, response will run interval within itself
		// Realistically, you will not run your client and
		// server from the same page

		function updateIframeContent () {
			iframe.srcdoc = this.response;
		}
	}


	function server () {

		setTimeout(server, interval);

		xhr.open("PUT", uri, true);
		xhr.onload = loaded;
		xhr.onerror = erred;

		xhr.send(doc);

		function loaded () {
			console.log("success", this.response);
		}

		function erred () {
			console.log("erred: ", this);
		}

	}

})(window, document);
</script>
…

```

## Development
Add `git@heroku.com:[app name here].git` as a new remote  using the git add command (`git add hero git@heroku.com:[app name here].git`)  
This will allow you to make code modifications and push them to the remote repo  
Just `add`, `commit` and `push` as normal, but don't forget to also `git push hero` (or whatever you've named the remote)  

## Running This App
`npm start` runs db.sh for the purpose of starting MongoDB locally (from a different terminal)  
`npm test` runs newman.sh for the sake of cleanliness, so that we can keep our runtime variables in one place and have a nice looking command.  
`npm stop` stops the application and/or database. Normal process:
* `[Ctrl+c]` stops the web server  
* `npm stop` close the database connection  
