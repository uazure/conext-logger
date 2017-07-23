import { Component, OnInit } from '@angular/core';
import { InverterConfigService } from 'app/services/inverterConfig/inverter-config.service';
import { StateService, State, InverterState } from 'app/services/stateService/state.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from 'app/services/store/appState';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	private inverterConfig: Observable<any>;
	private state: Observable<State>;
	private subscriptions: any[] = [];

  constructor(
		private inverterConfigService: InverterConfigService,
		private stateService: StateService,
		private store: Store<AppState>
	) {

		this.state = store.select('state').filter(Boolean);
		this.inverterConfig = store.select('inverterConfig').filter(Boolean);
		this.subscriptions.push(this.state.subscribe((v)=> {console.log('state', v)}));
		this.subscriptions.push(this.inverterConfig.subscribe((v)=> {console.log('inv conf', v)}));
	 }


  public ngOnInit() {
		this.stateService.launch();
  }

	public ngOnDestroy() {
		this.subscriptions.forEach((v) => v.unsubscribe());
	}
}
