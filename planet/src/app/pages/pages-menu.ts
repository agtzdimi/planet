import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Global Parameters',
    icon: 'nb-gear',
    link: '/pages/global-params',
  },
  {
    title: 'Scenario Creator',
    icon: 'nb-compose',
    children: [
      {
        title: 'Create New Simulation',
        link: '/pages/scenario-creator/new-simulation',
      },
      {
        title: 'Load Simulation',
        link: '/pages/scenario-creator/load-simulation',
      },
    ],
  },
  {
    title: 'Simulation Run',
    icon: 'nb-bar-chart',
    link: '/pages/simulation-run',
  },
  {
    title: 'Simulation Comparison',
    icon: 'nb-bar-chart',
    link: '/pages/simulation-comparison',
  },
  {
    title: 'Unit Management',
    icon: 'nb-grid-a-outline',
    children: [
      {
        title: 'Add',
        link: '/pages/unit-management/unit-add',
      },
      {
        title: 'Edit',
        link: '/pages/unit-management/unit-edit',
      },
      {
        title: 'Delete',
        link: '/pages/unit-management/unit-delete',
      },
    ],
  },
];
