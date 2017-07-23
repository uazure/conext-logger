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
Provides current state of the inverters including ac output and dc inputs
*/

import { Injectable } from '@angular/core';
import { AppConfigService } from 'app/services/appConfig/app-config.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from 'app/services/store/appState';
import { CREATE_SET_CURRENT_STATE } from 'app/services/store/actions';

// Import RxJs required methods
import 'rxjs/add/operator/map';
// import * as rx from 'rx';

@Injectable()
export class StateService {
	private apiUrl: string;
	private subject: Subject<any> = new Subject();
	static apiPath: string = 'state';
	private subscription: any;

  constructor(
		private appConfigService: AppConfigService,
		private http: Http,
		private store: Store<AppState>) {

		let appConfig = appConfigService.get();
		this.apiUrl = appConfig.backend + StateService.apiPath;
	}

	public launch() {
		if (this.subscription) {
			return;
		}
		this.fetch();
		this.subscription = this.subject.subscribe(state => {
			// console.log('dispath state', state.data);
			this.store.dispatch({type: CREATE_SET_CURRENT_STATE, payload: state.data});
		})
	}

	private fetchDelayed(timeout) {
		setTimeout(() => {
			this.fetch();
		}, timeout);
	}

	private fetch() {
		return this.http.get(this.apiUrl)
			.map(res => res.json())
			.subscribe(res => {
				if (res.success) {
					this.subject.next(res.payload);

					this.fetchDelayed(3000);
				} else {
					this.fetchDelayed(5000);
				}
			});
	}
}

export class State {
	public data: InverterState[];
}

export class InverterState {
	createdAt: Date;
	inverterId: number;
	// ... many more fields here
}
