import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxUploaderModule } from 'ngx-uploader';

import { ThemeModule } from '../../@theme/theme.module';

import { UploadFilesRoutingModule } from './upload-files-routing.module';
import { UploadFilesComponent } from './upload-files.component';
import { UploadSimulationFilesComponent } from './simulation-files/simulation-files.component'

const COMPONENTS = [
  UploadFilesComponent,
  UploadSimulationFilesComponent
];

const ENTRY_COMPONENTS = [
  UploadSimulationFilesComponent
];


@NgModule({
  imports: [
    ThemeModule,
    UploadFilesRoutingModule,
    NbButtonModule,
    NgxUploaderModule
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class UploadFilesModule { }
