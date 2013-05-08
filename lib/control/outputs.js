/*******************************************************************************
 * Output protocols
 ******************************************************************************/
var protocols = {
	graphite : require('../protocol/graphite'),
	opentsdb : require('../protocol/opentsdb')
};

var Outputs = module.exports = function(config) {
	if (!Array.isArray(config.outputs))
		throw new TypeError("Configuration parameter 'outputs' must be an array");

	var self = this;
	this.outputs = [];

	config.outputs.forEach(function(output) {
		var proto = protocols[output.protocol];
		if (!proto) {
			console.log("Unknown output protocol " + output.protocol + ". Ignoring.");
			return;
		}

		// Metric-path Root
		if (!output.root)
			output.root = config.root;

		// Default Tags
		if (typeof config.tags !== 'object')
			config.tags = {};
		if (typeof output.tags !== 'object')
			output.tags = {};
		Object.keys(config.tags).forEach(function(key) {
			if (output.tags[key])
				return;

			output.tags[key] = config.tags[key];
		});

		// Debugging
		output.debug = !!config.debug;

		// Connect to server
		proto.createConnection(output, function(err, conn) {
			if (err) {
				console.log("Error connecting to " + output.protocol + "://" + output.host + ":" + output.port);
				console.log(err.message);
				return;
			}

			console.log("Connected to " + output.protocol + "://" + output.host + ":" + output.port);
			self.outputs.push(conn);
		});
	});
};
Outputs.protocols = protocols;

Outputs.prototype.send = function(name, metric, root) {
	var self = this;
	if (!isNaN(+metric)) {
		metric = {
			value : +metric
		};
	} else if (isNaN(+(metric.value))) {
		console.log("Metric " + name + "'s value can not be evaluated as a number. Skipping.");
		return;
	} else {
		metric.value = +(metric.value);
	}

	// Ensure that timestamp is a number
	if (metric.timestamp instanceof Date)
		metric.timestamp = metric.timestam.getTime() / 1000;
	else if (isNaN(+(metric.timestamp)))
		metric.timestamp = Date.now() / 1000;
	metric.timestamp = Math.floor(metric.timestamp)

	// Tags
	if (typeof metric.tags !== 'object')
		metric.tags = {};

	this.outputs.forEach(function(output) {
		// Pluggin-specific metric-name root
		if (root)
			name = root + '.' + name;
		
		else if (output.root)
			name = output.root + '.' + name;

		output.send(name, metric);
	});
};
