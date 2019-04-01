import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScenarioCreatorComponent } from './scenario-creator.component';
import { NewSimulationFilesComponent } from './new-simulation/new-simulation.component';
import { LoadSimulationFilesComponent } from './load-simulation/load-simulation.component';


const routes: Routes = [{
  path: '',
  component: ScenarioCreatorComponent,
  children: [
    {
      path: 'new-simulation',
      component: NewSimulationFilesComponent,
    },
    {
      path: 'load-simulation',
      component: LoadSimulationFilesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScenarioCreatorRoutingModule { }
