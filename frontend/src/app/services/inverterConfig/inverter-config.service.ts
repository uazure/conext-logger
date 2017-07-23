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
Provides information about inverter configuration for current moment or
specified date. Method fetch returns the promise that is resolved with the
key-value storage where key is inverterId
*/

import { Injectable } from '@angular/core';
import { AppConfigService } from 'app/services/appConfig/app-config.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import { AppState } from 'app/services/store/appState';
import { CREATE_SET_INVERTER_CONFIG } from 'app/services/store/actions';

@Injectable()
export class InverterConfigService {
	private apiUrl: string;
	static apiPath: string = 'inverter-config';

  constructor(
		private appConfigService: AppConfigService,
		private http: Http,
		private store: Store<AppState>) {

			let appConfig = appConfigService.get();
			this.apiUrl = appConfig.backend + InverterConfigService.apiPath;
			this.put();
	}

	public put() {
		this.fetch().then((v) => {
			console.log('dispatch inverterConfig', v);
			this.store.dispatch({type: CREATE_SET_INVERTER_CONFIG, payload: v});
		})
	};

	public fetch(date: Date = null): Promise<any> {
		let url = this.apiUrl;

		if (date !== null) {
			url += '/' + date.toISOString();
		}

		return this.http.get(url)
			.toPromise()
			.then((res) => {
				return res.json().payload;
			});
	}

}
