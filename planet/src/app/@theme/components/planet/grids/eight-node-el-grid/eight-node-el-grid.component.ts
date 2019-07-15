import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-eight-node-el-grid',
    templateUrl: './eight-node-el-grid.component.html',
    styleUrls: ['./eight-node-el-grid.component.scss'],
})
export class EightNodeElGridComponent implements OnInit {

    selectedRoom: null;
    sortedRooms = [];
    viewBox = '-10 -10 768.88 567.99';
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
                name: { text: '', x: 20, y: 32.5 },
                number: {
                    text: '', x: 415, y: 20.1,
                    text2: '', x2: 435, y2: 4.1,
                },
                area: {
                    d: `M 100,0 L 450,0 M 280,0 V 25 M 200,25 M 365,25 V38 a 13,11 0 1,0 1,0 M 365,50 a 13,11 0 1,0 1,0Z
        M 365,71 V94 M 366, 95 L 350, 80 M 364, 95 L 380, 80 M 230,25 V 64 M 231,64 L 215,50  M 229,64 L 245, 50` },
                border: {
                    d: ``,
                },
            },
            {
                id: '1',
                name: { text: 'Node 1', x: 20, y: 32.5 },
                number: {
                    text: '', x: 415, y: 20.1,
                    text2: '', x2: 435, y2: 4.1,
                },
                area: {
                    d: `M 200,25 L 420,25`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '2',
                name: { text: 'Node 2', x: 20, y: 110 },
                number: { text: '', x: 415, y: 99 },
                area: {
                    d: `M 280,25 V 105 M 365,105 V118 a 13,11 0 1,0 1,0 M 365,130 a 13,11 0 1,0 1,0Z
       M 365,151 V174 M 366, 175 L 350, 160 M 364, 175 L 380, 160` },
                border: {
                    d: ``,
                },
            },
            {
                id: '3',
                name: { text: 'Node 2', x: 20, y: 110 },
                number: { text: '', x: 415, y: 99 },
                area: {
                    d: `M 200,105 L 420,105`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '4',
                name: { text: 'Node 3', x: 20, y: 190 },
                number: { text: '', x: 415, y: 141.1 },
                area: {
                    d: `M 280,105 V 185 M 365,185 V198 a 13,11 0 1,0 1,0 M 365,210 a 13,11 0 1,0 1,0Z
           M 365,231 V254 M 366, 255 L 350, 240 M 364, 255 L 380, 240`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '5',
                name: { text: 'Node 3', x: 20, y: 190 },
                number: { text: '', x: 415, y: 141.1 },
                area: {
                    d: `M 200,185 L 420,185`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '6',
                name: { text: 'Node 4', x: 20, y: 270 },
                number: { text: '', x: 415, y: 203.1 },
                area: {
                    d: `M 280,185 V 265 M 365,265 V278 a 13,11 0 1,0 1,0 M 365,290 a 13,11 0 1,0 1,0Z
          M 365,311 V334 M 366, 335 L 350, 320 M 364, 335 L 380, 320` },
                border: {
                    d: ``,
                },
            },
            {
                id: '7',
                name: { text: 'Node 4', x: 20, y: 270 },
                number: { text: '', x: 415, y: 203.1 },
                area: {
                    d: `M 200,265 L 420,265`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '8',
                name: { text: 'Node 5', x: 20, y: 350 },
                number: { text: '', x: 415, y: 265.1 },
                area: {
                    d: `M 280,265 V 345 M 365,345 V358 a 13,11 0 1,0 1,0 M 365,370 a 13,11 0 1,0 1,0Z
           M 365,391 V414 M 366, 415 L 350, 400 M 364, 415 L 380, 400` },
                border: {
                    d: ``,
                },
            },
            {
                id: '9',
                name: { text: 'Node 5', x: 20, y: 350 },
                number: { text: '', x: 415, y: 265.1 },
                area: {
                    d: `M 200,345 L 420,345`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '10',
                name: { text: 'Node 6', x: 20, y: 430 },
                number: { text: '', x: 415, y: 327.1 },
                area: {
                    d: `M 280,345 V 425 M 365,425 V438 a 13,11 0 1,0 1,0 M 365,450 a 13,11 0 1,0 1,0Z
          M 365,471 V494 M 366, 495 L 350, 480 M 364, 495 L 380, 480` },
                border: {
                    d: ``,
                },
            },
            {
                id: '11',
                name: { text: 'Node 6', x: 20, y: 430 },
                number: { text: '', x: 415, y: 327.1 },
                area: {
                    d: `M 150,425 L 420,425`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '12',
                name: { text: 'Node 7', x: 20, y: 510 },
                number: { text: '', x: 415, y: 389.1 },
                area: {
                    d: `M 280,425 V 505 M 365,505 V518 a 13,11 0 1,0 1,0 M 365,530 a 13,11 0 1,0 1,0Z
          M 365,551 V574 M 366, 575 L 350, 560 M 364, 575 L 380, 560 M 230,505 V 544 M 231,544 L 215,530  M 229,544 L 245, 530` },
                border: {
                    d: ``,
                },
            },
            {
                id: '13',
                name: { text: 'Node 7', x: 20, y: 510 },
                number: { text: '', x: 415, y: 389.1 },
                area: {
                    d: `M 200,505 L 420,505`,
                },
                border: {
                    d: ``,
                },
            },
            {
                id: '14',
                name: { text: 'Node 8', x: 20, y: 590 },
                number: { text: '', x: 415, y: 451.1 },
                area: {
                    d: `M 280,505 V 585 M 365,585 V598 a 13,11 0 1,0 1,0 M 365,610 a 13,11 0 1,0 1,0Z
          M 365,631 V654 M 366, 655 L 350, 640 M 364, 655 L 380, 640` },
                border: {
                    d: ``,
                },
            },
            {
                id: '15',
                name: { text: 'Node 8', x: 20, y: 590 },
                number: { text: '', x: 415, y: 451.1 },
                area: {
                    d: `M 200,585 L 420,585`,
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
