import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { SimulationRunComponent } from './simulation-run/simulation-run.component';
import { SimulationComparisonComponent } from './simulation-comparison/simulation-comparison.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
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
    path: '',
    redirectTo: 'scenario-creator',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
