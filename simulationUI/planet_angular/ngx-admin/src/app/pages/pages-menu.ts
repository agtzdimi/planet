import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Simulation',
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
    title: 'Start Simulation',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Single Simulation',
        link: '/pages/simulations/simulations',
      },
    ],
  },
];
