var OS = require('os');

var Config = module.exports = {
	base : "agent." + OS.hostname()
};
