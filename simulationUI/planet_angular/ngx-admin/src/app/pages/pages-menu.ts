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
    title: 'Simulation Results',
    icon: 'nb-bar-chart',
    link: '/pages/simulations',
  },
];
