import { RuntimeConfig } from 'app/services/runtimeConfig/runtime-config.service';
import { InverterState } from 'app/services/stateService/state.service';

export interface AppState {
	inverterConfig: any,
	runtimeConfig: RuntimeConfig,
	state: InverterState
};
