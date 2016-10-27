var crontab = require('node-crontab');
var LogJob = require('./log-job');

if (require.main === module) {
	// called directly
	crontab.scheduleJob('* * * * *', LogJob);
} else {
	module.exports = function() {
		//save values to db every 5 minutes
		crontab.scheduleJob('* * * * *', LogJob);
	};
}
