var OS = require('os');
var hostname = 'macbook'; //OS.hostname().replace(/\./g, '_');

var Config = module.exports = {
	root : "jmanero." + hostname, // Default metric-path root
	concurrency : 32,
	debug : true,
	outputs : [ { // Array of metric servers to push results to
		protocol : 'graphite', // graphite or opentsdb
		host : 'fringe-04.m.dyn.io',
		port : 2003
	}//, {
//		protocol : 'graphite',
//		host : 'some.other.server',
//		port : 2003,
//		root : hostname, // Connection-specific metric root
//	}, {
//		protocol : 'opentsdb',
//		host : 'some.other.server',
//		port : 1234
//	}
]
};
