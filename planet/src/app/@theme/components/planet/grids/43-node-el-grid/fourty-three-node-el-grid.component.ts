import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-fourty-three-el-grid',
    templateUrl: './fourty-three-el-grid.component.html',
    styleUrls: ['./fourty-three-el-grid.component.scss'],
})
export class FourtyThreeNodeElGridComponent implements OnInit {

    selectedRoom: null;
    sortedRooms = [];
    viewBox = '-10 -10 1200 1200';
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
                id: '0',
                name: { text: '', x: 370, y: 15 },
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
                id: '0',
                name: { text: '', x: 150, y: 120 },
                number: {
                    text: '1 551 411', x: 200, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 150,106 v20 m -110,0 h 225 m -60,0 v540 m -150,-540 v202`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '0',
                name: { text: '', x: 370, y: 15 },
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
                id: '0',
                name: { text: '', x: 150, y: 120 },
                number: {
                    text: '1 551 412', x: 465, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 415,106 v20 m -125,0 h 225 m -30,0 v430 m -145,-430 v600`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '0',
                name: { text: '', x: 370, y: 15 },
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
                id: '0',
                name: { text: '', x: 150, y: 120 },
                number: {
                    text: '1 551 413', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 635,106 v20 m -60,0 h 135 m -20,0 v800`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 1
            */
            {
                id: '1',
                name: { text: '204874', x: 130, y: 153 },
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
                id: '2',
                name: { text: '208221', x: 130, y: 213 },
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
                id: '3',
                name: { text: '203845', x: 130, y: 273 },
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
                id: '4',
                name: { text: '203844', x: 130, y: 333 },
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
                id: '5',
                name: { text: '203294', x: 269, y: 153 },
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
                id: '6',
                name: { text: '203548', x: 269, y: 213 },
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
                id: '7',
                name: { text: '205801', x: 269, y: 263 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,260 h 60`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '8',
                name: { text: '204514', x: 269, y: 313 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,310 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '9',
                name: { text: '204621', x: 269, y: 373 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,370 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '10',
                name: { text: '205428', x: 269, y: 433 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,430 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '11',
                name: { text: '205271', x: 269, y: 493 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,490 h 60`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '12',
                name: { text: '204659', x: 269, y: 553 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,550 h 60`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '13',
                name: { text: '203615', x: 269, y: 613 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,610 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '14',
                name: { text: '208265', x: 269, y: 673 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 175,670 h 60`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 3
            */
            {
                id: '15',
                name: { text: '205358', x: 412, y: 153 },
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
                id: '16',
                name: { text: '205802', x: 412, y: 213 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,210 h 60`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '17',
                name: { text: '205024', x: 412, y: 263 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,260 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '18',
                name: { text: '204730', x: 412, y: 313 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,310 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '19',
                name: { text: '204748', x: 412, y: 373 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,370 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '20',
                name: { text: '204813', x: 412, y: 433 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,430 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '21',
                name: { text: '203975', x: 412, y: 493 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,490 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '22',
                name: { text: '20394', x: 412, y: 553 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,550 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '23',
                name: { text: '204716', x: 412, y: 613 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,610 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '24',
                name: { text: '203385', x: 412, y: 673 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,670 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '25',
                name: { text: '203558', x: 412, y: 733 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 318,730 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            /*
            BRANCH 4
            */
            {
                id: '26',
                name: { text: '204871', x: 557, y: 153 },
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
                id: '27',
                name: { text: '204228', x: 557, y: 213 },
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
                id: '28',
                name: { text: '204171', x: 557, y: 263 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,260 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '29',
                name: { text: '204201', x: 557, y: 313 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,310 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '30',
                name: { text: '204216', x: 557, y: 373 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,370 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '31',
                name: { text: '204193', x: 557, y: 433 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,430 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '32',
                name: { text: '203202', x: 557, y: 493 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,490 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '33',
                name: { text: '203765', x: 557, y: 553 },
                number: {
                    text: '', x: 685, y: 120,
                    text2: '', x2: 150, y2: 100.1,
                },
                area: {
                    d: `M 463,550 h 60 m -10,0 v10 a 8,6 0 1,0 1,0 m -1,7 a 8,6 0 1,0 1,0Z m 0,15 v5 m 5,0 -10,0 5,5 Z`,
                },
                border: {
                    d: ``,
                },
            },
        ],
    };

    constructor() {
        this.selectRoom('1');
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

    selectRoom(roomNumber) {
        if (roomNumber % 2 === 1) {
            this.selectedRoom = roomNumber;
            this.sortRooms();
        }

    }

}
