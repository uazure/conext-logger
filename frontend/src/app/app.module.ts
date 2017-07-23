import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { HistoryComponent } from 'app/components/history/history.component';
import { PageNotFoundComponent } from 'app/components/page-not-found/page-not-found.component';
import { StateComponent } from 'app/components/state/state.component';
import { InverterConfigService } from 'app/services/inverterConfig/inverter-config.service';
import { RuntimeConfigService } from 'app/services/runtimeConfig/runtime-config.service';
import { AppConfigService } from 'app/services/appConfig/app-config.service';
import { StateService } from 'app/services/stateService/state.service';
import { StoreModule } from '@ngrx/store';
import { REDUCERS } from 'app/services/reducers';


const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: HistoryComponent },
	{ path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HistoryComponent,
    PageNotFoundComponent,
    StateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
		RouterModule.forRoot(appRoutes),
		StoreModule.provideStore(REDUCERS)
  ],
  providers: [InverterConfigService, RuntimeConfigService, AppConfigService, StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
