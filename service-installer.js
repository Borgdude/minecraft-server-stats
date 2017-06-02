var Service = require('node-windows').Service;

var svc = new Service({
  name: 'Minecraft Server Bot',
  description: "THingy McJiger",
  script: "F:\\Projects\\minecraft-server-stats\\index.js"
});

svc.on('install',function(){
  svc.start();
});

svc.install();