var Net = require('net');
var Util = require('util');

var OpenTSDB = module.exports = function(options) {
	Net.Socket.call(this);
	options = options || {};
	
	this.prefix = options.prefix || "";
	this.tags = options.tags;
	this.debug = !!options.debug;
	this.host = options.host;
	this.port = options.port;
	
	// Keep the receive buffer empty
	this.on('data', function(data) {
	});
};
Util.inherits(OpenTSDB, Net.Socket);

OpenTSDB.prototype.send = function(name, metric) {
	if (this.prefix)
		name = this.prefix + '.' + name;

	// Merge and filter tags
	var tags = metric.tags;
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
	
	var message = Buffer(name + " " + timestamp + " " + value + " " + tags + "\n");
	
	if(this.debug)
		console.log("opentsdb://" + this.host + ":" + this.port + " " + message.toString('utf8').trim());
	
	this.write(message);
};

OpenTSDB.createConnection = function(options, callback) {
	var sock = new OpenTSDB(options);
	sock.connect(options.port, options.host, function(err) {
		callback(err, sock);
	});

	return sock;
};
