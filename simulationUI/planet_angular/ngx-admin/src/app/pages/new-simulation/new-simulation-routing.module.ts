import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSimulationComponent } from './new-simulation.component';
import { NewSimulationFilesComponent } from './simulation-files/simulation-files.component';


const routes: Routes = [{
  path: '',
  component: NewSimulationComponent,
  children: [
    {
      path: 'simulation',
      component: NewSimulationFilesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSimulationRoutingModule { }
