import { NgModule } from '@angular/core';
import { NbCardModule, NbMenuModule, NbUserModule, NbIconModule, NbListModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SystemParamsModule } from './system-params/system-params.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { UserAdministrationComponent, FullNameComponent } from './user-administration/user-administration.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbUserModule,
    NbIconModule,
    NbListModule,
    Ng2SmartTableModule,
    NbCardModule,
    MiscellaneousModule,
    SimulationRunModule,
    SimulationComparisonModule,
    SystemParamsModule,
  ],
  declarations: [
    PagesComponent,
    UserProfileComponent,
    FullNameComponent,
    WelcomeScreenComponent,
    UserAdministrationComponent,
  ],
  entryComponents: [
    FullNameComponent,
  ],
})
export class PagesModule {
}
