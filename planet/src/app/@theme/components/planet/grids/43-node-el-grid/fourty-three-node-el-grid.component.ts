import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TechnologiesDialogComponent } from '../energy-grid/energy-grid.tech.component';

@Component({
    selector: 'ngx-fourty-three-el-grid',
    templateUrl: './fourty-three-el-grid.component.html',
    styleUrls: ['./fourty-three-el-grid.component.scss'],
})
export class FourtyThreeNodeElGridComponent implements OnInit {

    selectedRoom: null;
    sortedRooms = [];
    viewBox = '-10 -10 1200 1250';
    isIE = !!(navigator.userAgent.match(/Trident/)
        || navigator.userAgent.match(/MSIE/)
        || navigator.userAgent.match(/Edge/));
    isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
    roomSvg = {
        borders: [{
            d: '',
        }],
        rooms: [
            {
                id: '0',
                name: { text: '220kV', x: 470, y: 15 },
                isNode: false,
                number: {
                    text: '', x: 415, y: 20.1,
                    text2: '', x2: 435, y2: 4.1,
                },
                area: {
                    d: `M400,0 h30 v 20 h-30 v-20 m 15,20 v 30 m-350,0 h 800`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '1',
                name: { text: '', x: 370, y: 15 },
                isNode: false,
                number: {
                    text: '63 MVA', x: 89, y: 83.1,
                    text2: '220/22kV', x2: 85, y2: 100.1,
                },
                area: {
                    d: `M 150,50 v20 a 13,11 0 1,0 1,0 m -1,12 a 13,11 0 1,0 1,0Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '2',
                name: { text: '', x: 150, y: 120 },
                isNode: false,
                number: {
                    text: '1 551 411', x: 200, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 150,106 v20 m -110,0 h 225 m -60,0 v325 m -150,-325 v202`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '3',
                name: { text: '', x: 370, y: 15 },
                isNode: false,
                number: {
                    text: '55 MVA', x: 359, y: 83.1,
                    text2: '220/22kV', x2: 355, y2: 100.1,
                },
                area: {
                    d: `M 415,50 v20 a 13,11 0 1,0 1,0 m -1,12 a 13,11 0 1,0 1,0Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '4',
                name: { text: '', x: 150, y: 120 },
                isNode: false,
                number: {
                    text: '1 551 412', x: 465, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 415,106 v20 m -125,0 h 225 m -30,0 v442 m -145,-442 v565`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '5',
                name: { text: '', x: 370, y: 15 },
                isNode: false,
                number: {
                    text: '63 MVA', x: 579, y: 83.1,
                    text2: '220/22kV', x2: 575, y2: 100.1,
                },
                area: {
                    d: `M 635,50 v20 a 13,11 0 1,0 1,0 m -1,12 a 13,11 0 1,0 1,0Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '6',
                name: { text: '', x: 150, y: 120 },
                isNode: false,
                number: {
                    text: '1 551 413', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 635,106 v20 m -60,0 h 135 m -38,0 v865`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 1
            */
            {
                id: '7',
                name: { text: 'node.1', x: 130, y: 153 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 35,150 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '8',
                name: { text: 'node.2', x: 130, y: 213 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 35,210 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '9',
                name: { text: 'node.3', x: 130, y: 273 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 35,270 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '10',
                name: { text: 'node.4', x: 130, y: 333 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 35,330 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 2
            */
            {
                id: '11',
                name: { text: 'node.5', x: 269, y: 153 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,150 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '12',
                name: { text: 'node.6', x: 269, y: 213 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,210 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '13',
                name: { text: 'node.7', x: 269, y: 273 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,270 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '14',
                name: { text: 'node.8', x: 269, y: 333 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,330 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '15',
                name: { text: 'node.9', x: 269, y: 393 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,390 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '16',
                name: { text: 'node.10', x: 269, y: 453 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,450 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 3
            */
            {
                id: '17',
                name: { text: 'node.11', x: 412, y: 153 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 135, y2: 100.1,
                },
                area: {
                    d: `M 318,150 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '18',
                name: { text: 'node.12', x: 412, y: 213 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,210 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '19',
                name: { text: 'node.13', x: 412, y: 273 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,270 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '20',
                name: { text: 'node.14', x: 412, y: 333 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,330 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '21',
                name: { text: 'node.15', x: 412, y: 393 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,390 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '22',
                name: { text: 'node.16', x: 412, y: 453 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,450 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '23',
                name: { text: 'node.17', x: 412, y: 513 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,510 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '24',
                name: { text: 'node.18', x: 412, y: 573 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,570 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '25',
                name: { text: 'node.19', x: 412, y: 633 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,630 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '26',
                name: { text: 'node.20', x: 412, y: 693 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,690 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 4
            */
            {
                id: '27',
                name: { text: 'node.21', x: 557, y: 153 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 135, y2: 100.1,
                },
                area: {
                    d: `M 463,150 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '28',
                name: { text: 'node.22', x: 557, y: 213 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,210 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '29',
                name: { text: 'node.23', x: 557, y: 273 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,270 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '30',
                name: { text: 'node.24', x: 557, y: 333 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,330 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '31',
                name: { text: 'node.25', x: 557, y: 393 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,390 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '32',
                name: { text: 'node.26', x: 557, y: 453 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,450 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '33',
                name: { text: 'node.27', x: 557, y: 513 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,510 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '34',
                name: { text: 'node.28', x: 557, y: 573 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,570 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 5
            */
            {
                id: '35',
                name: { text: 'node.29', x: 750, y: 153 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,150 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '36',
                name: { text: 'node.30', x: 750, y: 213 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,210 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '37',
                name: { text: 'node.31', x: 750, y: 273 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,270 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '38',
                name: { text: 'node.32', x: 750, y: 333 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,330 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '39',
                name: { text: 'node.33', x: 750, y: 393 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,390 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '40',
                name: { text: 'node.34', x: 750, y: 453 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,450 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '41',
                name: { text: 'node.35', x: 750, y: 513 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,510 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '42',
                name: { text: 'node.36', x: 750, y: 573 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,570 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '43',
                name: { text: 'node.37', x: 750, y: 633 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,630 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '44',
                name: { text: 'node.38', x: 750, y: 693 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,690 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '45',
                name: { text: 'node.39', x: 750, y: 753 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,750 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '46',
                name: { text: 'node.40', x: 750, y: 813 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,810 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '47',
                name: { text: 'node.41', x: 750, y: 873 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,870 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '48',
                name: { text: 'node.42', x: 750, y: 933 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,930 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '49',
                name: { text: 'node.43', x: 750, y: 993 },
                isNode: true,
                isActivated: true,
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 653,990 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
        ],
    };

    constructor(private dialogService: NbDialogService) {
        this.selectRoom('7', false);
    }

    ngOnInit() {
    }

    private sortRooms() {
        this.sortedRooms = this.roomSvg.rooms.slice(0).sort((a, b) => {
            if (a.id === this.selectedRoom) {
                return 1;
            }
            if (b.id === this.selectedRoom) {
                return -1;
            }
            return 0;
        });
    }

    selectRoom(roomNumber, showDialog) {
        if (this.roomSvg['rooms'][roomNumber]['isNode']) {
            this.selectedRoom = roomNumber;
            if (showDialog) {
                this.open(true);
            }

            this.sortRooms();
        }

    }

    protected open(hasBackdrop: boolean) {
        let type: string;
        const number: number = this.selectedRoom;

        type = this.roomSvg['rooms'][number]['name']['text'];
        this.dialogService.open(TechnologiesDialogComponent, { hasBackdrop, 'context': type })
            .onClose.subscribe(
                (data) => {
                    if (data['activated']) {
                        this.bottomUpLoop(number, data['activated']);
                    } else {
                        this.topDownLoop(number, data['activated']);
                    }

                },
            );
    }

    public bottomUpLoop(number: number, activated: boolean) {
        if (number <= 10) {
            for (let i = number; i >= 7; i--) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                }
            }
        } else if (number <= 16) {
            for (let i = number; i >= 11; i--) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                }
            }
        } else if (number <= 26) {
            for (let i = number; i >= 17; i--) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                }
            }
        } else if (number <= 34) {
            for (let i = number; i >= 27; i--) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                }
            }
        } else if (number <= 49) {
            for (let i = number; i >= 35; i--) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                }
            }
        }
        let deactivatedNodes = 1;
        for (let i = 7; i <= 49; i++) {
            if (this.roomSvg['rooms'][i]['isActivated']) {
                this.roomSvg['rooms'][i]['name']['text'] = 'node.' + deactivatedNodes;
                deactivatedNodes += 1;
            }
        }
    }

    public topDownLoop(number: number, activated: boolean) {
        if (number <= 10) {
            for (let i = number; i <= 10; i++) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                    this.roomSvg['rooms'][i]['name']['text'] = '';
                }
            }
        } else if (number <= 16) {
            for (let i = number; i <= 16; i++) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                    this.roomSvg['rooms'][i]['name']['text'] = '';
                }
            }
        } else if (number <= 26) {
            for (let i = number; i <= 26; i++) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                    this.roomSvg['rooms'][i]['name']['text'] = '';
                }
            }
        } else if (number <= 34) {
            for (let i = number; i <= 34; i++) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                    this.roomSvg['rooms'][i]['name']['text'] = '';
                }
            }
        } else if (number <= 49) {
            for (let i = number; i <= 49; i++) {
                if (this.roomSvg['rooms'][i]['isNode']) {
                    this.roomSvg['rooms'][i]['isActivated'] = activated;
                    this.roomSvg['rooms'][i]['name']['text'] = '';
                }
            }

        }
        let deactivatedNodes = 6;
        for (let i = 7; i <= 49; i++) {
            if (!this.roomSvg['rooms'][i]['isActivated']) {
                deactivatedNodes += 1;
            }
        }
        for (let i = number; i <= 49; i++) {
            if (this.roomSvg['rooms'][i]['isActivated']) {
                this.roomSvg['rooms'][i]['name']['text'] = 'node.' + (i - deactivatedNodes);
            }
        }
    }

}
