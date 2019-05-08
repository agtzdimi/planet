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
        name: { text: 'Node 1', x: -50, y: 4.1 },
        number: {
          text: '204871', x: 415, y: 20.1,
          text2: '1551412', x2: 435, y2: 4.1,
        },
        area: {
          d: `M 20,0 L 220,0 M 135,0 V 15 M 90,15 L 190,15 M 175,15 V30 a 9,7 0 1,0 1,0 M 175,38 a 9,7 0 1,0 1,0Z
        M 175,53 V66 M 176, 67 L 167, 58 M 174, 67 L 163, 58 M 105,15 V 45 M 106,45 L 97,36  M 104,46 L 113, 36` },
        border: {
          d: ``,
        },
      },
      {
        id: '1',
        name: { text: 'Node 2', x: 0, y: 79.1 },
        number: { text: '204228', x: 415, y: 79.1 },
        area: {
          d: `M 270,77 L 380,77 M 315,16 V 77 M 355,77 V92 a 9,7 0 1,0 1,0 M 355,100 a 9,7 0 1,0 1,0Z
        M 355,115 V128 M 356, 129 L 347, 120 M 354, 129 L 363, 120` },
        border: {
          d: ``,
        },
      },
      {
        id: '2',
        name: { text: 'Node 3', x: 0, y: 141.1 },
        number: { text: '204171', x: 415, y: 141.1 },
        area: {
          d: `M 270,139 L 380,139 M 315,78 V 139 M 355,139 V154 a 9,7 0 1,0 1,0 M 355,162 a 9,7 0 1,0 1,0Z
          M 355,177 V190 M 356, 191 L 347, 182 M 354, 191 L 363, 182`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '3',
        name: { text: 'Node 4', x: 0, y: 203.1 },
        number: { text: '204201', x: 415, y: 203.1 },
        area: {
          d: `M 270,201 L 380,201 M 315,141 V 201 M 355,201 V216 a 9,7 0 1,0 1,0 M 355,224 a 9,7 0 1,0 1,0Z
          M 355,239 V252 M 356, 253 L 347, 243 M 354, 253 L 363, 244` },
        border: {
          d: ``,
        },
      },
      {
        id: '4',
        name: { text: 'Node 5', x: 0, y: 265.1 },
        number: { text: '204216', x: 415, y: 265.1 },
        area: {
          d: `M 270,263 L 380,263 M 315,203 V 263 M 355,263 V278 a 9,7 0 1,0 1,0 M 355,286 a 9,7 0 1,0 1,0Z
          M 355,301 V314 M 356, 315 L 347, 305 M 354, 315 L 363, 306` },
        border: {
          d: ``,
        },
      },
      {
        id: '5',
        name: { text: 'Node 6', x: 0, y: 327.1 },
        number: { text: '204193', x: 415, y: 327.1 },
        area: {
          d: `M 200,325 L 380,325 M 315,265 V 325 M 355,325 V340 a 9,7 0 1,0 1,0 M 355,348 a 9,7 0 1,0 1,0Z
          M 355,363 V376 M 356, 377 L 347, 367 M 354, 377 L 363, 368` },
        border: {
          d: ``,
        },
      },
      {
        id: '6',
        name: { text: 'Node 7', x: 0, y: 389.1 },
        number: { text: '204202', x: 415, y: 389.1 },
        area: {
          d: `M 270,387 L 380,387 M 315,327 V 387 M 355,387 V402 a 9,7 0 1,0 1,0 M 355,410 a 9,7 0 1,0 1,0Z
          M 355,425 V438 M 356, 439 L 347, 429 M 354, 439 L 363, 430 M 285,387 V 417 M 286,417 L 277,408  M 284,417 L 293, 408` },
        border: {
          d: ``,
        },
      },
      {
        id: '7',
        name: { text: 'Node 8', x: 0, y: 451.1 },
        number: { text: '204765', x: 415, y: 451.1 },
        area: {
          d: `M 270,449 L 380,449 M 315,389 V 449 M 355,449 V464 a 9,7 0 1,0 1,0 M 355,472 a 9,7 0 1,0 1,0Z
          M 355,487 V500 M 356, 501 L 347, 491 M 354, 501 L 363, 492` },
        border: {
          d: ``,
        },
      },
    ],
  };

  constructor() {
    this.selectRoom('2');
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
    this.selectedRoom = roomNumber;
    this.sortRooms();
  }

}
