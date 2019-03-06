import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';
import { SuiModule } from 'ng2-semantic-ui';

import { UnitManagementRoutingModule } from './unit-management-routing.module';
import { UnitManagementComponent } from './unit-management.component';
import { UnitAddComponent } from './unit-add/unit-add.component';
import { P2GUnitComponent } from './unit-types/p2g-unit.component';


const COMPONENTS = [
  UnitManagementComponent,
  UnitAddComponent,
  P2GUnitComponent,
];

const ENTRY_COMPONENTS = [
  UnitManagementComponent,
  UnitAddComponent,
  P2GUnitComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    UnitManagementRoutingModule,
    NbButtonModule,
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
export class UnitManagementModule { }
