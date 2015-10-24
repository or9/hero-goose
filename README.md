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
