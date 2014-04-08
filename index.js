var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , config = require("./config").config;

app.listen(process.env.PORT || 5000);

function handler (req, res) {
  var url = req.url;
  if (url == '/controller') {
    fs.readFile(__dirname + '/controller.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading controller.html');
      }

      res.writeHead(200);
      res.end(data);
    });
  }
  else {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
  }
}


// io.configure(function () { 
//     io.set("transports", config[platform].transports); // Set config in ./config.js
//     io.set("polling duration", 10); 
//   io.set("log level", 2);
// });

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('controller', function (data) {
    console.log('controller: ' + data.command);
    socket.broadcast.emit('client', {message: data.command});
  });
  socket.on('client', function (data) {
    console.log('client: ' + data.command);
    socket.broadcast.emit('controller', {message: data.command});
  });
});