var FS = require('fs');
var Path = require('path');

var Startup = module.exports = function(path, queue) {
	var pluggins = {};
	
	FS.readdirSync(path).forEach(function(p) {
		p = Path.basename(p, '.js');
		var plug = require(Path.join(path, p));
		plug.name = p;

		if (!+(plug.interval)) {
			Util.log("Pluggin " + p + " doens't have a valid interval. Ignoring.");
			return;
		}

		if (typeof plug.run !== 'function') {
			Util.log("Pluggin " + p + " doens't have a valid run function. Ignoring.");
			return;
		}
		
		if(typeof plug.cleanup === 'function') {
			process.on('exit', function() {
				console.log("Calling 'cleanup' for " + p);
				plug.cleanup();
			});
		}
		
		console.log("Starting pluggin " + p + " with interval " + plug.interval);

		plug._interval = setInterval(function() {
			queue.push(plug);
		}, plug.interval * 1000);
		pluggins[p] = plug;
	});
	
	return pluggins;
};
