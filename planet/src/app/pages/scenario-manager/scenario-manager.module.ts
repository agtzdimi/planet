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
import { LoadScenarioComponent } from './load-scenario/load-scenario.component';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { ScenarioManagerRoutingModule } from './scenario-manager-routing.module';
import { ScenarioManagerComponent } from './scenario-manager.component';
import { TechControlComponent } from './tech-control/tech-control.component';
import { TechCostComponent } from './tech-cost/tech-cost.component';
import { TechParamComponent } from './tech-param/tech-param.component';

const COMPONENTS = [
  ScenarioManagerComponent,
  CreateScenarioComponent,
  LoadScenarioComponent,
  TechParamComponent,
  TechCostComponent,
];

const ENTRY_COMPONENTS = [
  CreateScenarioComponent,
  LoadScenarioComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ScenarioManagerRoutingModule,
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
export class ScenarioManagerModule { }
