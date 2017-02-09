// Copyright (c) 2017 Sergii Popov
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

'use strict';
var localConfig;
var TelegramBot;
var token;
var chatIds;
var bot;

try {
	localConfig = require('../local-config');
	TelegramBot = require('node-telegram-bot-api');
	token = localConfig.telegram.token;
	chatIds = localConfig.telegram.chatIds;
	bot = new TelegramBot(token, { polling: false });
} catch (er) {
	bot = null;
}

// uncomment to define chat id. Launch and send message to a bot

// bot.on('message', function(msg) {
// 	var chatId = msg.chat.id;
//
// 	console.log('chat id', chatId);
// });

if (bot) {
	module.exports = {
		broadcast: function(msg) {

			chatIds.forEach((chatId) => {
				bot.sendMessage(chatId, msg);
			});
		}
	};
} else {
	module.exports = null;
}

module.exports.broadcast('test2');
