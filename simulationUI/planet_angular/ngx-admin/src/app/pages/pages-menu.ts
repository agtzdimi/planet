import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Simulation',
    icon: 'nb-compose',
    children: [
      {
        title: 'Create New Form',
        link: '/pages/new-simulation',
      },
      {
        title: 'Load Form',
        link: '',
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
