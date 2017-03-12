# Conext logger #

It is a monitor/logger designed for my setup of two Schneider Electric Conext RL
solar inverters. You can see live version on http://solar.azure.pp.ua:8080/

It's UNDER DEVELOPMENT. It may require some steps that are not described here
in order to make it work on your computer.

It's a result of my investigation of Conext RL modbus protocol which is badly documented.
It uses modbus-serial library to access modbus. In this particular edition it uses
modbus over tcp (aka modbus-telnet), so it requires serial to tcp converter.
It also work with local serial port.

## Compatibility ##
This piece of software verified to work on Linux with node 4 and 6.
It should work on windows as well.

## Setup ##
    $ npm install
    # check config.js for database settings
    # then run createdb script to create tables
    $ node createdb.js
    $ cp local-config.js.example local-config.js
    # set your telegram bot id and chat id in local-config.js (if you have)
    # check inverterConfigInitialize.js and set correct values for your setup
    $ node inverterConfigInitialize.js

## Technical notes ##

### Technologies used ###
- Node / ECMAScript 6
- modbus-serial
- node-crontab
- express
- PostgreSQL
- sequelize
- angular
- socket.io
- bootstrap
- nvd3

### Known issues / TODO ###
- Some build system should be implemented to build all deps and minimize js
- Code need better comments
- nvd3 has some issues related to DOM updates. Should try to replace it
with chartjs http://www.chartjs.org/
- Integrate with some cloud storage to periodically dump database

## License ##
This software is licensed under terms of GPLv3. The license may be changed
if there will be reasonable arguments for such change.
