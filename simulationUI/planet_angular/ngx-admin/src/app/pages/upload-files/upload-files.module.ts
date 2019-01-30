import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';

import { UploadFilesRoutingModule } from './upload-files-routing.module';
import { UploadFilesComponent } from './upload-files.component';
import { UploadSimulationFilesComponent } from './simulation-files/simulation-files.component';
import { ParamHeaderComponent } from './simulation-files/param-header/param-header.component';
import { MatSlideToggleModule } from '@angular/material';
import { TechParamComponent } from './simulation-files/tech-param/tech-param.component';
import { TechCostComponent } from './simulation-files/tech-cost/tech-cost.component';
import { TechInputFieldComponent } from './simulation-files/tech-param/tech-input-field.component';
import { LeafletMapComponent } from './simulation-files/map/map.component';

const COMPONENTS = [
  UploadFilesComponent,
  UploadSimulationFilesComponent,
  ParamHeaderComponent,
  TechParamComponent,
  TechInputFieldComponent,
  TechCostComponent,
  LeafletMapComponent,
];

const ENTRY_COMPONENTS = [
  UploadSimulationFilesComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    UploadFilesRoutingModule,
    NbButtonModule,
    NgxUploaderModule,
    FormsModule,
    MatSlideToggleModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiYWd0emRpbWkiLCJhIjoiY2pyaXc2OWN6MDV0cTQ0cXd1NHA0cHI1OSJ9.NQIQGDjleOWNi7bpSu_AGw',
      geocoderAccessToken:
        'pk.eyJ1IjoiYWd0emRpbWkiLCJhIjoiY2pyaXc2OWN6MDV0cTQ0cXd1NHA0cHI1OSJ9.NQIQGDjleOWNi7bpSu_AGw',
    }),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class UploadFilesModule { }
