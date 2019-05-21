import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-energy-grid',
  templateUrl: './energy-grid.component.html',
  styleUrls: ['./energy-grid.component.scss'],
})
export class EnergyGridComponent implements OnInit {

  @Input() gasNodes: number;
  @Input() dhNodes: number;
  @Input() elecNodes: number;
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
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'Gas', x: 17, y: 372,
          text2: 'Network', x2: 17, y2: 394,
        },
        area: {
          d: `M 20,0 V350`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '1',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'DH', x: 197, y: 372,
          text2: 'Network', x2: 197, y2: 394,
        },
        area: {
          d: `M 200,0 V350`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '2',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'Electrical', x: 377, y: 372,
          text2: 'Grid', x2: 377, y2: 394,
        },
        area: {
          d: `M 380,0 V350`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '3',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 1, x: 20, y: 180,
          text2: '', x2: 377, y2: 394,
        },
        area: {
          d: `M 20, 175
          m -15, 0
          a 15,15 0 1,0 30,0
          a 15,15 0 1,0 -30,0`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '4',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 1, x: 200, y: 180,
          text2: '', x2: 377, y2: 394,
        },
        area: {
          d: `M 200, 175
          m -15, 0
          a 15,15 0 1,0 30,0
          a 15,15 0 1,0 -30,0`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '5',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 1, x: 380, y: 180,
          text2: '', x2: 377, y2: 394,
        },
        area: {
          d: `M 380, 175
          m -15, 0
          a 15,15 0 1,0 30,0
          a 15,15 0 1,0 -30,0`,
        },
        border: {
          d: ``,
        },
      },
    ],
  };

  constructor() {
    this.generateNodes();
    this.selectRoom('3');
  }

  ngOnInit() {
  }

  generateNodes() {
    for (let gas = 0; gas < this.gasNodes; gas++) {

    }
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
    if (typeof (this.roomSvg['rooms'][roomNumber]['number']['text']) === 'number') {
      this.selectedRoom = roomNumber;
      this.sortRooms();
    }
  }

  checkNode(node) {
    if (typeof (node) === 'number') {
      return 4;
    } else if (node === 'Gas') {
      return 1;
    } else if (node === 'DH') {
      return 2;
    } else if (node === 'Electrical') {
      return 3;
    }

  }

}
