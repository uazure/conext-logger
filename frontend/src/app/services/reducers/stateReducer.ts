import { ActionReducer, Action } from '@ngrx/store';
import { CREATE_SET_CURRENT_STATE } from 'app/services/store/actions';

export function stateReducer (state: any = null, action: Action) {
	switch (action.type) {
		case CREATE_SET_CURRENT_STATE:
			return [...action.payload]
		default:
			return state;
	}
}
