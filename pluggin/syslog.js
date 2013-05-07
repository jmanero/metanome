var CP = require('child_process');
var Path = require('path');

exports.interval = 5000;

// Tail default syslog output
var messages = CP.spawn('tail', ['-n 0', '-F', "/var/log/messages"]);

// Count lines
var messagesBuffer = "";
var messagesCount = 0;
messages.stdout.on('data', function(data) {
	if(data instanceof Buffer)
		data = data.toString('utf8');
	
	var lines = (messagesBuffer + data).split(/\r?\n/g);
	messagesBuffer = lines.pop(); // Buffer fragment
	
	messagesCount += lines.length;
})

exports.run = function(callback) {
	callback(null, {
		'syslog.messages' : messagesCount
	});
	messagesCount = 0;
}

exports.cleanup = function() {
	messages.disconnect();
	messages.kill();
};
