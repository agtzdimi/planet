import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';

import { SimulationRoutingModule } from './simulation-routing.module';
import { SimulationComponent } from './simulation.component';
import { NewSimulationFilesComponent } from './new-simulation/new-simulation.component';
import { LoadSimulationFilesComponent } from './load-simulation/load-simulation.component';
import { ParamHeaderComponent } from './new-simulation/param-header/param-header.component';
import { MatSlideToggleModule } from '@angular/material';
import { TechParamComponent } from './new-simulation/tech-param/tech-param.component';
import { TechCostComponent } from './new-simulation/tech-cost/tech-cost.component';
import { TechInputFieldComponent } from './new-simulation/tech-param/tech-input-field.component';
import { DialogTechParamPromptComponent } from './new-simulation/dialog-prompt/tech-param-dialog.component';
import { DialogControlSystemPromptComponent } from './new-simulation/dialog-prompt/control-system-dialog.component';
import { DialogEconomyPromptComponent } from './new-simulation/dialog-prompt/economy-dialog.component';
import { LeafletMapComponent } from './new-simulation/map/map.component';
import { DialogNamePromptComponent } from './new-simulation/dialog-prompt/dialog-prompt.component';
import { NbDialogModule } from '@nebular/theme';


const COMPONENTS = [
  SimulationComponent,
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
  ParamHeaderComponent,
  TechParamComponent,
  TechInputFieldComponent,
  TechCostComponent,
  LeafletMapComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
];

const ENTRY_COMPONENTS = [
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationRoutingModule,
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
export class SimulationModule { }
