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

(function(angular) {
	'use strict';
	angular.module('app').factory('sunPositionService', ['appConfig', function(appConfig) {
		return {
			get: function(date) {
				var coords;

				if (!date) {
					date = new Date();
				}

				if (appConfig.coordinates) {
					coords = appConfig.coordinates;
				} else {
					coords = {lat: 50, lon: 36};
					console.warn('No coordinates, using default', coords);
				}

				var pos = SunCalc.getPosition(date, coords.lat, coords.lon);

				return {
					azimuth: ((pos.azimuth * 180 / Math.PI) - 180) % 360,
					altitude: pos.altitude * 180 / Math.PI
				};
			},
			/**
			Method for getting power factor for specified panel orientation
			panelOrientation must have {tilt, azimuth}
			sunPosition must have {azimuth, altitude}

			returns object with azimuthCos, altitudeCos and powerFactor
			*/
			getPowerFactor(panelOrientation, sunPosition) {
				var response = {
					altitudeCos: 0,
					azimuthCos: 0,
					powerFactor: 0
				};

				response.altitudeCos = Math.max(Math.cos((90 - panelOrientation.tilt - sunPosition.altitude) / 180 * Math.PI), 0);
				response.azimuthCos = Math.max(Math.cos((sunPosition.azimuth - panelOrientation.azimuth) / 180 * Math.PI), 0);
				response.powerFactor = response.altitudeCos * response.azimuthCos;

				return response;
			}
		}

	}]
	);
}(window.angular));
