import { ActionReducer, Action } from '@ngrx/store';
import { CREATE_SET_RUNTIME_CONFIG } from 'app/services/store/actions';
import { RuntimeConfig } from 'app/services/runtimeConfig/runtime-config.service';

export function runtimeConfigReducer(state: RuntimeConfig = null, action: Action): RuntimeConfig {
	switch (action.type) {
		case CREATE_SET_RUNTIME_CONFIG:
			return {...action.payload};
		default:
			return state;
	};
}
