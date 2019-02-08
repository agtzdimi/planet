import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulationComponent } from './simulation.component';
import { NewSimulationFilesComponent } from './new-simulation/new-simulation.component';
import { LoadSimulationFilesComponent } from './load-simulation/load-simulation.component';


const routes: Routes = [{
  path: '',
  component: SimulationComponent,
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
export class SimulationRoutingModule { }
