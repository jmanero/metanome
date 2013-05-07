var Net = require('net');
var Util = require('util');

var OpenTSDB = module.exports = function(host, port, options) {
	Net.Socket.call(this);
	options = options || {};

	this.prefix = "";
	if (typeof options.prefix === 'string')
		this.prefix = options.prefix;

	this.tags = {};
	if (options.tags instanceof Object)
		this.tags = options.tags;

	// Keep the receive buffer empty
	this.on('data', function(data) {
	});
};
Util.inherits(OpenTSDB, Net.Socket);

OpenTSDB.prototype.send = function(name, metric) {
	var value, timestamp, tags = {};
	if (metric instanceof Object) {
		if (!timestamp)
			timestamp = metric.timestamp;

		value = metric.value;
		tags = metric.tags;

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

	Object.keys(this.tags).forEach(function(k) {
		if (tags.hasOwnProperty(k))
			return;

		tags[k] = this.tags[k];
	});

	tags = Object.keys(tags).filter(function(k) {
		return (tags[k] !== null);
	}).map(function(k) {
		return (k + "=" + tags[k]);
	}).join(" ");

	var message = Buffer(name + " " + timestamp + " " + value + " " + tags);
	// console.log("OpenTSDB:// " + message.toString('utf8'));
	this.write(message);
};

OpenTSDB.createConnection = function(options, callback) {
	var sock = new OpenTSDB(options.host, options.port, options);
	sock.connect(function(err) {
		callback(null, sock);
	});

	return sock;
};
