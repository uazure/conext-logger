var crontab = require('node-crontab');
var LogJob = require('./log-job');

module.exports = function() {
	//save values to db every minute
	crontab.scheduleJob('* * * * *', LogJob);
};
