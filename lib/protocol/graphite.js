var Net = require('net');
var Util = require('util');

var Graphite = module.exports = function(options) {
	Net.Socket.call(this);
	options = options || {};

	this.prefix = options.prefix || "";
	this.host = options.host;
	this.port = options.port;

	// Keep the receive buffer empty
	this.on('data', function(data) {
		console.log(data.toString('utf8'));
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

	var message = Buffer(name + " " + value + " " + timestamp + "\n");
	// console.log("Graphite://" + this.host + ":" + this.port + " " +
	// message.toString('utf8'));
	this.write(message);
};

Graphite.createConnection = function(options, callback) {
	var sock = new Graphite(options);
	sock.connect(options.port, options.host, function(err) {
		callback(err, sock);
	});

	return sock;
};
