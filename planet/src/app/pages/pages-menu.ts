import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Welcome Screen',
    icon: 'settings-2-outline',
    link: '/pages/welcome-screen',
    hidden: true,
    home: true,
  },
  {
    title: 'System Parameters',
    icon: 'settings-2-outline',
    link: '/pages/system-params',
  },
  {
    title: 'Scenario Manager',
    icon: 'file-text',
    children: [
      {
        title: 'Create New Scenario',
        link: '/pages/scenario-creator/new-simulation',
      },
      {
        title: 'Load Scenario',
        link: '/pages/scenario-creator/load-simulation',
      },
      {
        title: 'Delete Scenario',
        link: '/pages/scenario-creator/delete-scenario',
      },
    ],
  },
  {
    title: 'Simulation Run',
    icon: 'activity',
    link: '/pages/simulation-run',
  },
  {
    title: 'Simulation Comparison',
    icon: 'pie-chart-2',
    link: '/pages/simulation-comparison',
  },
  {
    title: 'Unit Management',
    icon: 'grid-outline',
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
