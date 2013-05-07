/*******************************************************************************
 * Output protocols
 ******************************************************************************/
var protocols = {
	graphite : require('../protocol/graphite'),
	opentsdb : require('../protocol/opentsdb')
};

var Outputs = module.exports = function(conf) {
	if (!Array.isArray(conf.outputs))
		throw new TypeError("Param 'outputs' must be an array");

	var self = this;
	var outputs = conf.outputs;
	this.outputs = [];

	outputs.forEach(function(out) {
		var proto = protocols[out.protocol];
		if (!proto) {
			console.log("Unknown protocol " + out.protocol + ". Ignoring.");
			return;
		}

		// Default Prefix
		if (!out.prefix)
			out.prefix = conf.prefix;
		
		// Default Tags
		out.tags = out.tags || {};
		conf.tags = conf.tags || {};
		Object.keys(conf.tags).forEach(function(key) {
			if(out.tags[key])
				return;
			
			out.tags[key] = conf.tags[key];
		});

		proto.createConnection(out, function(err, conn) {
			if (err) {
				console.log("Error connecting to " + out.protocol + "://" + out.host + ":" + out.port);
				console.log(err.message);
				return;
			}

			console.log("Connected to " + out.protocol + "://" + out.host + ":" + out.port);
			self.outputs.push(conn);
		});
	});
};

Outputs.prototype.send = function(name, metric) {
	this.outputs.forEach(function(out) {
		out.send(name, metric);
	});
};
