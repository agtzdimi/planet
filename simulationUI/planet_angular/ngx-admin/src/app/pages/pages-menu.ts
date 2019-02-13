import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Scenario Creator',
    icon: 'nb-compose',
    children: [
      {
        title: 'Create New Simulation',
        link: '/pages/simulation/new-simulation',
      },
      {
        title: 'Load Simulation',
        link: '/pages/simulation/load-simulation',
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
];
