import {inverterConfigReducer} from './inverterConfigReducer';
import {stateReducer} from './stateReducer';
import {runtimeConfigReducer} from './runtimeConfigReducer';

export const REDUCERS = {
	inverterConfig: inverterConfigReducer,
	state: stateReducer,
	runtimeConfig: runtimeConfigReducer
};
