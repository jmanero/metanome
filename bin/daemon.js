var Path = require('path');
var Queue = require('qrly');

var config = require('../config');

/*******************************************************************************
 * Controllers
 ******************************************************************************/
var Pluggins = require('../lib/control/pluggins');
var Outputs = require('../lib/control/outputs');

var outputs = new Outputs(config);

/*******************************************************************************
 * Run Queue
 ******************************************************************************/
var tasks = new Queue({
	flushable : false,
	collect : false,
	concurrency : +(config.concurrency) || 32
});

tasks.worker = function(pluggin, done) {
	pluggin.run(function(err, metrics) {
		Object.keys(metrics).forEach(function(key) {
			if (metrics[key] instanceof Array) {
				metrics[key].forEach(function(m) {
					outputs.send(key, m, pluggin.root);
				})
			} else {
				outputs.send(key, metrics[key], pluggin.root);
			}
		});

		done();
	});
};

/*******************************************************************************
 * Pluggins
 ******************************************************************************/
Pluggins.load(Path.resolve(__dirname, '../pluggin'), tasks);
