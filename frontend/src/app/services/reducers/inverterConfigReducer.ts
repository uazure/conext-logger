import { ActionReducer, Action } from '@ngrx/store';
import { CREATE_SET_INVERTER_CONFIG } from 'app/services/store/actions';

export function inverterConfigReducer(state: any = null, action: Action) {
	switch (action.type) {
		case CREATE_SET_INVERTER_CONFIG:
			return {...action.payload};
		default:
			return state;
	}
}
