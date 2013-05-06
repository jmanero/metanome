var OS = require('os');

exports.interval = 5000;

// Constants
var numCpus = OS.cpus().length;
var totalMem = OS.totalmem();

// Metric Generator
exports.run = function(callback) {
	var load = OS.loadavg();
	var metrics = {
		'cpu.load1' : (load[0] / numCpus) * 100,
		'cpu.load5' : (load[1] / numCpus) * 100,
		'cpu.load60' : (load[2] / numCpus) * 100,
		'memory' : 100 - (OS.freemem() / totalMem) * 100
	};

	callback(null, metrics);
};

// Cleanup tasks (optional)
exports.cleanup = function() {
};
