import { Component, Input } from '@angular/core';
import { State } from 'app/services/stateService/state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent{
	@Input()
	public states: State;

	@Input()
	public inverterConfig: any;

	private showDetails: boolean = false;

	private showDetailsToggle() {
		this.showDetails != this.showDetails;
	}
}
