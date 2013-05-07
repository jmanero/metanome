var Net = require('net');
var Util = require('util');

var Graphite = module.exports = function(options) {
	Net.Socket.call(this);
	options = options || {};

	this.prefix = options.prefix || "";
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
	if (this.prefix)
		name = this.prefix + '.' + name;
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
