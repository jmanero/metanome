var OS = require('os');
var hostname = 'macbook'; //OS.hostname().replace(/\./g, '_');

var Config = module.exports = {
	prefix : "jmanero." + hostname, // Default metric prefix
	concurrency : 32,
	outputs : [ { // Array of metric servers to push results to
		protocol : 'graphite', // graphite or opentsdb
		host : 'fringe-04.m.dyn.io',
		port : 2003
	}//, {
//		protocol : 'graphite',
//		host : 'some.other.server',
//		port : 2003,
//		prefix : hostname, // Connection-specific metric prefix
//	}, {
//		protocol : 'opentsdb',
//		host : 'some.other.server',
//		port : 1234
//	}
]
};
