var FS = require('fs');
var Path = require('path');
var Util = require('util');

/*******************************************************************************
 * Load Pluggins
 ******************************************************************************/
var pluggins = {};
var plugginDir = Path.join(__dirname, '../pluggins');
FS.readdirSync(plugginDir).forEach(function(p) {
	p = Path.basename(p, '.js');
	var plug = require(Path.join("../pluggins", p));
	
	if(!+(plug.interval)) {
		Util.log("Pluggin " + p + " doens't have a valid interval. Ignoring.");
		return;
	}
	
	if(typeof plug.run !== 'function') {
		Util.log("Pluggin " + p + " doens't have a valid run function. Ignoring.");
		return;
	}
	
	if(typeof plug.start === 'function')
		plug.start();
	
	plug._interval = setInterval(function() {
		plug.run(function(err, metrics) {
			console.log(Util.inspect(metrics));
		});
	}, plug.interval);
	pluggins[p] = plug;
});

console.log(Util.inspect(pluggins));
