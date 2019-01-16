import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadFilesComponent } from './upload-files.component';
import { UploadSimulationFilesComponent } from './simulation-files/simulation-files.component';


const routes: Routes = [{
  path: '',
  component: UploadFilesComponent,
  children: [
    {
      path: 'simulation',
      component: UploadSimulationFilesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadFilesRoutingModule { }
