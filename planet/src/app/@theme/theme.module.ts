import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MatSlideToggleModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbRadioModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';

/* General Components */
import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
  ThemeSettingsComponent,
  ToggleSettingsButtonComponent,
} from './components';

/* Auth Components */
import {
  NgxAuthBlockComponent,
  NgxAuthComponent,
  NgxRequestPasswordComponent,
  NgxSendResetRequestComponent,
  NgxResetPasswordComponent,
  NgxLoginComponent,
  NgxLogoutComponent,
  NgxCreateAccountComponent,
  NgxRegisterComponent,
} from './components';

/* PLANET Components */
import {
  TechInputFieldComponent,
  ScenarioPanelComponent,
  P2HUnitComponent,
  LeafletMapComponent,
  SimulationBarsComponent,
  SimulationsLineComponent,
  SimulationsNodesComponent,
  WTUnitComponent,
  VESUnitComponent,
  PVUnitComponent,
  EGUnitComponent,
  GGUnitComponent,
  P2GUnitComponent,
  G2HUnitComponent,
  DHGUnitComponent,
  CHPUnitComponent,
  TechnologiesDialogComponent,
  EnergyGridComponent,
  EightNodeElGridComponent,
  ScenPanelCheckBoxComponent,
  ScenPanelSimIconComponent,
} from './components';
import { OneColumnLayoutComponent } from './layouts';
import { CapitalizePipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';

/* Services */
import {
  AddOutboundConnService,
  DeleteDeviceService,
  DeleteOutboundConnService,
  EditDeviceService,
  EditOutboundConnService,
  GetAreaGridsService,
  GetDeviceTypeService,
  GetDeviceByTypeService,
  GetJWTService,
  WindowModeBlockScrollService,
  UserProfileService,
  GetOutboundConnService,
  CreateDeviceService,
} from './services';

import { CORPORATE_THEME } from './styles/theme.corporate';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DARK_THEME } from './styles/theme.dark';
import { DEFAULT_THEME } from './styles/theme.default';

/* Dialog Components */
import {
  DialogInfoPromptComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
  DialogSelectMultipleFormPromptComponent,
  DialogSubmitPromptComponent,
} from './components';
import { CheckBoxesService } from './components/planet/general-components/scenario-panel/scenario-panel-checkboxes-values.service';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbCardModule,
  NbInputModule,
  NbSpinnerModule,
  NbSearchModule,
  NbSidebarModule,
  NbAlertModule,
  NbTabsetModule,
  NbListModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbRadioModule,
  NbCheckboxModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  NgxAuthBlockComponent,
  EightNodeElGridComponent,
  TechInputFieldComponent,
  ScenarioPanelComponent,
  NgxLoginComponent,
  NgxAuthComponent,
  EnergyGridComponent,
  NgxRegisterComponent,
  ThemeSettingsComponent,
  NgxSendResetRequestComponent,
  NgxResetPasswordComponent,
  NgxRequestPasswordComponent,
  NgxCreateAccountComponent,
  TechnologiesDialogComponent,
  NgxLogoutComponent,
  ToggleSettingsButtonComponent,
  VESUnitComponent,
  P2HUnitComponent,
  G2HUnitComponent,
  DHGUnitComponent,
  WTUnitComponent,
  EGUnitComponent,
  GGUnitComponent,
  CHPUnitComponent,
  PVUnitComponent,
  P2GUnitComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
  SimulationBarsComponent,
  SimulationsNodesComponent,
  LeafletMapComponent,
  DialogSubmitPromptComponent,
  DialogInfoPromptComponent,
  ScenPanelCheckBoxComponent,
  ScenPanelSimIconComponent,
];
const ENTRY_COMPONENTS = [
  TechnologiesDialogComponent,
  DialogSelectFormPromptComponent,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
  SimulationBarsComponent,
  SimulationsNodesComponent,
  DialogSubmitPromptComponent,
  DialogInfoPromptComponent,
  ScenarioPanelComponent,
  ScenPanelCheckBoxComponent,
  ScenPanelSimIconComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];
const SERVICES = [
  UserProfileService,
  WindowModeBlockScrollService,
  AddOutboundConnService,
  CreateDeviceService,
  DeleteDeviceService,
  DeleteOutboundConnService,
  EditDeviceService,
  EditOutboundConnService,
  GetAreaGridsService,
  GetDeviceTypeService,
  GetDeviceByTypeService,
  GetJWTService,
  GetOutboundConnService,
  CheckBoxesService,
];
const GENERAL_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  Ng2SmartTableModule,
  NgxEchartsModule,
  MatSlideToggleModule,
  SuiModule,
  NgxMapboxGLModule.withConfig({
    accessToken: 'pk.eyJ1IjoiYWd0emRpbWkiLCJhIjoiY2pyaXc2OWN6MDV0cTQ0cXd1NHA0cHI1OSJ9.NQIQGDjleOWNi7bpSu_AGw',
    geocoderAccessToken:
      'pk.eyJ1IjoiYWd0emRpbWkiLCJhIjoiY2pyaXc2OWN6MDV0cTQ0cXd1NHA0cHI1OSJ9.NQIQGDjleOWNi7bpSu_AGw',
  }),
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, GENERAL_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
        ).providers,
        SERVICES,
      ],
    };
  }
}
