var Discordie = require('discordie');
var http = require('http');
var SSH = require('simple-ssh');
var EventLogger = require('node-windows').EventLogger;
var log = new EventLogger('Minecraft Server Bot');

var ssh = new SSH({
    host: '50.24.168.201',
    user: 'borgdude',
    pass: 'jakedude0108'
});

const Events = Discordie.Events;
const client = new Discordie();

const MCAPI_URL = "http://mcapi.ca/query/50.24.168.201/info";

client.connect({
  token: "MzE5NTU2NTk0MzkwMDA3ODE4.DBCpzg.OwDEPyGb1AGpcHoptjAayGeVXcw"
});

client.Dispatcher.on("GATEWAY_READY", e => {
  log.info("Connected as: " + client.User.username);
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "ping")
    e.message.channel.sendMessage("pong");
  if (e.message.content == "server-status") {
    http.get(MCAPI_URL, (res) => {
      var body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        var statusResponse = JSON.parse(body);
        console.log("Got Response");
        if(statusResponse.status){
          e.message.channel.sendMessage(":\nIP: " + statusResponse.hostname + "\nOnline: "+ statusResponse.status 
            + "\nPlayers: " + statusResponse.players.online + "/" + statusResponse.players.max);
        } else {
          e.message.channel.sendMessage(":\nIP: " + statusResponse.hostname + "\nOnline: " + statusResponse.status
             + "\nError: " + statusResponse.status);
        }
      });
    }).on("error", (error) => {
      console.log("ERROR: " + error);
      log.error(error);
      e.message.channel.sendMessage("ERROR: " + error);  
    });
  }
  if(e.message.content == "server-start"){
    startServer(e);
  }
});

var startServer = (e) => {
  ssh.on('error', function(err) {
    console.log('Oops, something went wrong.');
    console.log(err);
    log.error(stderr);
    ssh.end();
  })
  .exec("startserver-4gb.bat", {
    err: function(stderr) {
        console.log(stderr);
        log.error(stderr);
        e.message.channel.sendMessage("ERROR: `" + stderr + "`")
    },
    out: console.log.bind(console)
  })
  .start({
    fail: (err) => {
      console.log(err);
      log.error(stderr);
      e.message.channel.sendMessage("ERROR: `" + err + "`")
    }
  });
}