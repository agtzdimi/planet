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
import { UnitEditComponent } from './unit-edit/unit-edit.component';
import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
import { P2GUnitComponent } from './unit-types/p2g-unit/p2g-unit.component';
import { PVUnitComponent } from './unit-types/pv-unit/pv-unit.component';
import { CHPUnitComponent } from './unit-types/chp-unit/chp-unit.component';
import { GGUnitComponent } from './unit-types/gg-unit/gg-unit.component';
import { EGUnitComponent } from './unit-types/eg-unit/eg-unit.component';
import { WTUnitComponent } from './unit-types/wt-unit/wt-unit.component';
import { DHGUnitComponent } from './unit-types/dhg-unit/dhg-unit.component';
import { G2HUnitComponent } from './unit-types/g2h-unit/g2h-unit.component';
import { P2HHeatPumpUnitComponent } from './unit-types/p2h-heat-pump-unit/p2h-heat-pump-unit.component';
import { P2HElectricHeatUnitComponent } from './unit-types/p2h-electric-heat-unit/p2h-electric-heat-unit.component';
import { UnitModelsComponent } from './unit-edit/unit-models.component';
import { DialogDeleteComponent } from './unit-delete/dialog-delete.component';
import { NbDialogModule } from '@nebular/theme';


const COMPONENTS = [
  UnitManagementComponent,
  UnitAddComponent,
  UnitEditComponent,
  UnitDeleteComponent,
  P2GUnitComponent,
  PVUnitComponent,
  G2HUnitComponent,
  DHGUnitComponent,
  WTUnitComponent,
  EGUnitComponent,
  GGUnitComponent,
  CHPUnitComponent,
  P2HHeatPumpUnitComponent,
  P2HElectricHeatUnitComponent,
  UnitModelsComponent,
  DialogDeleteComponent,
];

const ENTRY_COMPONENTS = [
  UnitManagementComponent,
  DialogDeleteComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    UnitManagementRoutingModule,
    NbButtonModule,
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
export class UnitManagementModule { }
