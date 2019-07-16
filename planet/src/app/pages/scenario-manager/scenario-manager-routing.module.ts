import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScenarioManagerComponent } from './scenario-manager.component';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { LoadScenarioComponent } from './load-scenario/load-scenario.component';
import { DeleteScenarioComponent } from './delete-scenario/delete-scenario.component';


const routes: Routes = [{
  path: '',
  component: ScenarioManagerComponent,
  children: [
    {
      path: 'create-scenario',
      component: CreateScenarioComponent,
    },
    {
      path: 'load-scenario',
      component: LoadScenarioComponent,
    },
    {
      path: 'delete-scenario',
      component: DeleteScenarioComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScenarioManagerRoutingModule { }
