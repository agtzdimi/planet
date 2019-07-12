import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbSpinnerModule, NbTabsetModule, NbSelectModule, NbListModule, NbRadioModule, NbDatepickerModule, NbPopoverModule } from '@nebular/theme';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';

import { ScenarioCreatorRoutingModule } from './scenario-creator-routing.module';
import { ScenarioCreatorComponent } from './scenario-creator.component';
import { NewSimulationFilesComponent } from './new-simulation/new-simulation.component';
import { LoadSimulationFilesComponent } from './load-simulation/load-simulation.component';
import { MatSlideToggleModule } from '@angular/material';
import { TechParamComponent } from './tech-param/tech-param.component';
import { TechCostComponent } from './tech-cost/tech-cost.component';
import { DialogTechParamPromptComponent } from './dialog-prompt/tech-param-dialog.component';
import { DialogControlSystemPromptComponent } from './dialog-prompt/control-system-dialog.component';
import { DialogEconomyPromptComponent } from './dialog-prompt/economy-dialog.component';
import { LeafletMapComponent } from './map/map.component';
import { DialogSelFormPromptComponent } from './dialog-prompt/select-form.component';
import { DialogNamePromptComponent } from './dialog-prompt/dialog-prompt.component';
import { NbDialogModule } from '@nebular/theme';
import { HighlDirective } from './dialog-prompt/highlight.directive';
import { GeneralParamsComponent } from './general-params/general-params.component';
import { TechControlComponent } from './tech-control/tech-control.component';
import { DeleteScenarioComponent } from './delete-scenario/delete-scenario.component';
import { DeleteHighlightDirective } from './delete-scenario/dialog-prompt/delete-highlight.directive';
import { DialogDeleteFormPromptComponent } from './delete-scenario/dialog-prompt/delete-form.component';
import { DeleteScenarioDialogComponent } from './delete-scenario/dialog-prompt/delete-scenario-dialog.component';

const COMPONENTS = [
  ScenarioCreatorComponent,
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
  TechParamComponent,
  TechCostComponent,
  LeafletMapComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
  DialogSelFormPromptComponent,
  HighlDirective,
  DeleteHighlightDirective,
  DialogDeleteFormPromptComponent,
  DeleteScenarioDialogComponent,
];

const ENTRY_COMPONENTS = [
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
  DialogNamePromptComponent,
  DialogTechParamPromptComponent,
  DialogControlSystemPromptComponent,
  DialogEconomyPromptComponent,
  DialogSelFormPromptComponent,
  DialogDeleteFormPromptComponent,
  DeleteScenarioDialogComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    ScenarioCreatorRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    NbRadioModule,
    NbDatepickerModule,
    NbPopoverModule,
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
    GeneralParamsComponent,
    TechControlComponent,
    DeleteScenarioComponent,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ScenarioCreatorModule { }
