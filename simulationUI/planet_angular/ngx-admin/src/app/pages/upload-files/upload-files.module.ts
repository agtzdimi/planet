import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxUploaderModule } from 'ngx-uploader';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';

import { UploadFilesRoutingModule } from './upload-files-routing.module';
import { UploadFilesComponent } from './upload-files.component';
import { UploadSimulationFilesComponent } from './simulation-files/simulation-files.component'
import { ParamHeaderComponent } from './simulation-files/param-header/param-header.component'
import { MatSlideToggleModule } from '@angular/material';
import { TechParamComponent } from './simulation-files/tech-param/tech-param.component'

const COMPONENTS = [
  UploadFilesComponent,
  UploadSimulationFilesComponent,
  ParamHeaderComponent,
  TechParamComponent
];

const ENTRY_COMPONENTS = [
  UploadSimulationFilesComponent
];


@NgModule({
  imports: [
    ThemeModule,
    UploadFilesRoutingModule,
    NbButtonModule,
    NgxUploaderModule,
    FormsModule,
    MatSlideToggleModule
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class UploadFilesModule { }
