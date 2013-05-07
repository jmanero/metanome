/*******************************************************************************
 * Output protocols
 ******************************************************************************/
var protocols = {
	graphite : require('../protocol/graphite'),
	opentsdb : require('../protocol/opentsdb')
};

var Outputs = module.exports = function(outputs, prefix) {
	if (!Array.isArray(outputs))
		throw new TypeError("Param 'outputs' must be an array");

	var self = this;
	this.outputs = [];

	outputs.forEach(function(out) {
		var proto = protocols[out.protocol];
		if (!proto) {
			console.log("Unknown protocol " + out.protocol + ". Ignoring.");
			return;
		}

		if(!out.prefix)
			out.prefix = prefix;
		
		proto.createConnection(out, function(err, conn) {
			self.outputs.push(conn);
		});
	});
};

Outputs.prototype.send = function(name, metric) {
	this.outputs.forEach(function(out) {
		out.send(name, metric);
	});
};
