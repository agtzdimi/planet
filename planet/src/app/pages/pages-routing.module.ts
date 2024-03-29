import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { SystemParamsComponent } from './system-params/system-params.component';
import { SimulationRunComponent } from './simulation-run/simulation-run.component';
import { SimulationComparisonComponent } from './simulation-comparison/simulation-comparison.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'miscellaneous',
    loadChildren: () => import('./miscellaneous/miscellaneous.module')
      .then(m => m.MiscellaneousModule),
  }, {
    path: 'system-params',
    component: SystemParamsComponent,
  }, {
    path: 'scenario-manager',
    loadChildren: () => import('./scenario-manager/scenario-manager.module')
      .then(m => m.ScenarioManagerModule),
  }, {
    path: 'simulation-run',
    component: SimulationRunComponent,
  }, {
    path: 'simulation-comparison',
    component: SimulationComparisonComponent,
  }, {
    path: 'unit-management',
    loadChildren: () => import('./unit-management/unit-management.module')
      .then(m => m.UnitManagementModule),
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'user-administration',
    component: UserAdministrationComponent,
  },
  {
    path: 'welcome-screen',
    component: WelcomeScreenComponent,
  },
  {
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
