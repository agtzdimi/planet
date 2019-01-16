import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulationsComponent } from './simulations.component';
import { SimulationsFilesComponent } from './simulation-start/simulation-start.component';


const routes: Routes = [{
  path: '',
  component: SimulationsComponent,
  children: [
    {
      path: 'simulations',
      component: SimulationsFilesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule { }
