var Path = require('path');
var Queue = require('qrly');
var Util = require('util');

var config = require('../config');

/*******************************************************************************
 * Controllers
 ******************************************************************************/
var Pluggins = require('../lib/control/load-pluggins');
var Outputs = require('../lib/control/load-outputs');

var tasks = new Queue({
	flushable : false,
	collect : false,
	concurrency : +(config.concurrency) || 32
});

var outputs = new Outputs(config.outputs, config.prefix);

tasks.worker = function(pluggin, done) {
	pluggin.run(function(err, metrics) {
		Object.keys(metrics).forEach(function(key) {
			if(metrics[key] instanceof Array) {
				metrics[key].forEach(function(m) {
					outputs.send(key, m);
				})
			} else { 
				outputs.send(key, metrics[key]);
			}
		})
		
		done();
	});
};

var pluggins = Pluggins(Path.resolve(__dirname, '../pluggin'), tasks);
