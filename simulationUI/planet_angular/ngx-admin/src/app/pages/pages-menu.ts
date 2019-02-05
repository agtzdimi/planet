import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'New Simulation',
    icon: 'nb-compose',
    link: '/pages/new-simulation',
  },
  {
    title: 'Simulations',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Start Simulations',
        link: '/pages/simulations/simulations',
      },
    ],
  },
];
