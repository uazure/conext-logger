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

/**
Provides information about runtime config. It contains cooridnates for the
solar power plant. It is used by FE to calculate sun position
*/

import { Injectable } from '@angular/core';
import { AppConfigService } from 'app/services/appConfig/app-config.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import { AppState } from 'app/services/store/appState';
import { CREATE_SET_RUNTIME_CONFIG } from 'app/services/store/actions';


@Injectable()
export class RuntimeConfigService {
	private apiUrl: string;
	static apiPath: string = 'runtime-config';

	constructor(
		private appConfigService: AppConfigService,
		private http: Http,
		private store: Store<AppState>)
		{
			let appConfig = appConfigService.get();
			this.apiUrl = appConfig.backend + RuntimeConfigService.apiPath;
			this.put();
		}

	private put() {
		this.fetch().then((v) => {
			this.store.dispatch({type: CREATE_SET_RUNTIME_CONFIG, payload: v});
		});
	}

	private fetch(): Promise<RuntimeConfig> {
		return this.http.get(this.apiUrl)
			.toPromise()
			.then((res) => {
				return res.json().payload as RuntimeConfig;
			});
	}

}

export class RuntimeConfig {
	public coordinates: Cooridnates;
}

export class Cooridnates {
	public lat: number;
	public lon: number;
}
