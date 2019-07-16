import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbListModule,
  NbPopoverModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
} from '@nebular/theme';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxUploaderModule } from 'ngx-uploader';
import { ThemeModule } from '../../@theme/theme.module';
import { DeleteScenarioComponent } from './delete-scenario/delete-scenario.component';
import { GeneralParamsComponent } from './general-params/general-params.component';
import { LoadSimulationFilesComponent } from './load-simulation/load-simulation.component';
import { NewSimulationFilesComponent } from './new-simulation/new-simulation.component';
import { ScenarioCreatorRoutingModule } from './scenario-creator-routing.module';
import { ScenarioCreatorComponent } from './scenario-creator.component';
import { TechControlComponent } from './tech-control/tech-control.component';
import { TechCostComponent } from './tech-cost/tech-cost.component';
import { TechParamComponent } from './tech-param/tech-param.component';

const COMPONENTS = [
  ScenarioCreatorComponent,
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
  TechParamComponent,
  TechCostComponent,
];

const ENTRY_COMPONENTS = [
  NewSimulationFilesComponent,
  LoadSimulationFilesComponent,
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
