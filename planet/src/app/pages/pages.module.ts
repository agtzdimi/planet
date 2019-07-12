import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { SystemParamsModule } from './system-params/system-params.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    MiscellaneousModule,
    SimulationRunModule,
    SimulationComparisonModule,
    SystemParamsModule,
  ],
  declarations: [
    PagesComponent,
    UserProfileComponent,
    WelcomeScreenComponent,
  ],
})
export class PagesModule {
}
