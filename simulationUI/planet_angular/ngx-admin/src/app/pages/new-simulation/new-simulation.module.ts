import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';

import { NewSimulationRoutingModule } from './new-simulation-routing.module';
import { NewSimulationComponent } from './new-simulation.component';
import { NewSimulationFilesComponent } from './simulation-files/simulation-files.component';
import { ParamHeaderComponent } from './simulation-files/param-header/param-header.component';
import { MatSlideToggleModule } from '@angular/material';
import { TechParamComponent } from './simulation-files/tech-param/tech-param.component';
import { TechCostComponent } from './simulation-files/tech-cost/tech-cost.component';
import { TechInputFieldComponent } from './simulation-files/tech-param/tech-input-field.component';
import { DialogTechParamPromptComponent } from './simulation-files/dialog-prompt/tech-param-dialog.component';
import { DialogControlSystemPromptComponent } from './simulation-files/dialog-prompt/control-system-dialog.component';
import { DialogEconomyPromptComponent } from './simulation-files/dialog-prompt/economy-dialog.component';
import { DialogSaveParamPromptComponent } from './simulation-files/dialog-prompt/save-param-dialog.component';
import { LeafletMapComponent } from './simulation-files/map/map.component';
import { DialogNamePromptComponent } from './simulation-files/dialog-prompt/dialog-prompt.component';
import { NbDialogModule } from '@nebular/theme';


const COMPONENTS = [
  NewSimulationComponent,
  NewSimulationFilesComponent,
  ParamHeaderComponent,
  TechParamComponent,
  TechInputFieldComponent,
  TechCostComponent,
  LeafletMapComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
  DialogSaveParamPromptComponent,
];

const ENTRY_COMPONENTS = [
  NewSimulationFilesComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
  DialogSaveParamPromptComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    NewSimulationRoutingModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    NgxUploaderModule,
    FormsModule,
    MatSlideToggleModule,
    SuiModule,
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
export class NewSimulationModule { }
