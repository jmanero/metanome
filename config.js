var OS = require('os');
var hostname = OS.hostname().replace(/\./g, '_');

var Config = module.exports = {
	prefix : "agent." + hostname, // Default metric prefix
	concurrency : 32,
	outputs : [ { // Array of metric servers to push results to
		protocol : 'graphite', // graphite or opentsdb
		host : 'graphite.corp.dyndns.com',
		port : 2003,
		user : "foo",
		password : "bar"
	}//, {
//		protocol : 'graphite',
//		host : 'some.other.server',
//		port : 2003,
//		user : "foo",
//		password : "bar",
//		prefix : hostname, // Connection-specific metric prefix
//	}, {
//		protocol : 'opentsdb',
//		host : 'some.other.server',
//		port : 1234,
//		user : "foo",
//		password : "bar"
//	}
]
};
