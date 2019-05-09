import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { GlobalParamsModule } from './global-params/global-params.module';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    SimulationRunModule,
    SimulationComparisonModule,
    GlobalParamsModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    UserProfileComponent,
    WelcomeScreenComponent,
  ],
})
export class PagesModule {
}
