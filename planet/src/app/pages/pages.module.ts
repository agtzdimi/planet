import { NgModule } from '@angular/core';
import { NbCardModule, NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SystemParamsModule } from './system-params/system-params.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';

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
