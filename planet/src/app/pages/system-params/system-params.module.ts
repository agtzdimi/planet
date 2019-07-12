import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbStepperModule, NbSpinnerModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';
import { SuiModule } from 'ng2-semantic-ui';

import { SystemParamsRoutingModule } from './system-params-routing.module';
import { SystemParamsComponent } from './system-params.component';
import { ParamsSetupComponent } from './params-setup/params-setup.component';
import { NbDialogModule } from '@nebular/theme';

const COMPONENTS = [
  SystemParamsComponent,
  ParamsSetupComponent,
];

const ENTRY_COMPONENTS = [
  SystemParamsComponent,
  ParamsSetupComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SystemParamsRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbStepperModule,
    NbDialogModule.forRoot(),
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
    NgxEchartsModule,
    SuiModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SystemParamsModule { }
