var Net = require('net');
var Util = require('util');

var Graphite = module.exports = function(options) {
	Net.Socket.call(this);
	options = options || {};

	this.root = options.root || "";
	this.debug = !!options.debug;
	this.host = options.host;
	this.port = options.port;

	// Keep the receive buffer empty
	this.on('data', function(data) {
		console.log(data.toString('utf8'));
	});
};
Util.inherits(Graphite, Net.Socket);

Graphite.prototype.send = function(name, metric) {
	var message = Buffer(name + " " + metric.value + " " + metric.timestamp + "\n");
	if(this.debug)
		console.log("graphite://" + this.host + ":" + this.port + " " + message.toString('utf8').trim());
	
	this.write(message);
};

Graphite.createConnection = function(options, callback) {
	var sock = new Graphite(options);
	sock.connect(options.port, options.host, function(err) {
		callback(err, sock);
	});

	return sock;
};
