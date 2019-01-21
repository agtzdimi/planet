import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Upload-Files',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Simulation Files',
        link: '/pages/upload-files/simulation',
      },
    ],
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
