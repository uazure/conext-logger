var crontab = require('node-crontab');
var LogJob = require('./log-job');

module.exports = function() {
	//save values to db every 5 minutes
	crontab.scheduleJob('*/5 * * * *', LogJob);
};
