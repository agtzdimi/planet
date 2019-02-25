import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { SimulationRunComponent } from './simulation-run/simulation-run.component';
import { SimulationComparisonComponent } from './simulation-comparison/simulation-comparison.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [ {
    path: 'miscellaneous',
    loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  }, {
    path: 'simulation',
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
  },
  {
    path: '',
    redirectTo: 'simulation',
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
