import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { SimulationRunComponent } from './simulation-run/simulation-run.component';
import { SimulationComparisonComponent } from './simulation-comparison/simulation-comparison.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { GlobalParamsComponent } from './global-params/global-params.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  }, {
    path: 'global-params',
    component: GlobalParamsComponent,
  }, {
    path: 'scenario-creator',
    loadChildren: './scenario-creator/scenario-creator.module#ScenarioCreatorModule',
  }, {
    path: 'simulation-run',
    component: SimulationRunComponent,
  }, {
    path: 'simulation-comparison',
    component: SimulationComparisonComponent,
  }, {
    path: 'manage-accounts',
    loadChildren: './manage-accounts/manage-accounts.module#ManageAccountsModule',
  }, {
    path: 'unit-management',
    loadChildren: './unit-management/unit-management.module#UnitManagementModule',
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'welcome-screen',
    component: WelcomeScreenComponent,
  },
  {
    path: '',
    redirectTo: 'scenario-creator',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
