var Net = require('net');
var Util = require('util');

var Graphite = module.exports = function(host, port, options) {
	Net.Socket.call(this);
	options = options || {};

	this.prefix = options.prefix || "";

	// Keep the receive buffer empty
	this.on('data', function(data) {
	});
};
Util.inherits(Graphite, Net.Socket);

Graphite.prototype.send = function(name, metric) {
	var value, timestamp;
	if (metric instanceof Object) {
		if (!timestamp)
			timestamp = metric.timestamp;

		value = metric.value;

		if (metric.timestamp instanceof Date)
			timestamp = metric.timestam.getTime() / 1000;
		else if (!isNaN(+(metric.timestamp)))
			timestamp = metric.timestamp;

	} else {
		value = metric;
	}

	if (isNaN(+value)) // Value must be a number
		return;

	if (isNaN(+timestamp))
		timestamp = Date.now() / 1000;
	timestamp = Math.floor(timestamp);

	if (this.prefix)
		name = this.prefix + '.' + name;

	var message = Buffer(name + " " + value + " " + timestamp);
	// console.log("Graphite:// " + message.toString('utf8'));
	this.write(message);
};

Graphite.createConnection = function(options, callback) {
	var sock = new Graphite(options.host, options.port, options);
	sock.connect(function(err) {
		callback(null, sock);
	});

	return sock;
};
