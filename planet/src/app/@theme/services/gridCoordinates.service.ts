import { Injectable } from '@angular/core';

@Injectable()
export class GridCoordinatesService {

    private gridCoordinates = [
        // Turin: 7.6000496, 45.0702388
        { name: 'Node 1', x: 7.6000496, y: 45.0702388 },
        { name: 'Node 2', x: 7.3951703, y: 45.0760791 },
        { name: 'Node 3', x: 7.3522620, y: 45.0417620 },
        { name: 'Node 4', x: 7.6600496, y: 45.0702388 },
        { name: 'Node 5', x: 7.4701690, y: 45.0205720 },
        { name: 'Node 6', x: 7.4695070, y: 44.9901830 },
        { name: 'Node 7', x: 7.6600496, y: 45.1702388 },
        { name: 'Node 8', x: 7.8126730, y: 45.0146160 },
    ];

    private gridLinks = [
        { name: 'Node 1', source: 'Node 1', target: 'Node 2' },
        { name: 'Node 2', source: 'Node 2', target: 'Node 3' },
        { name: 'Node 3', source: 'Node 2', target: 'Node 3' },
        { name: 'Node 4', source: 'Node 1', target: 'Node 4' },
        { name: 'Node 5', source: 'Node 3', target: 'Node 5' },
        { name: 'Node 6', source: 'Node 5', target: 'Node 6' },
        { name: 'Node 7', source: 'Node 4', target: 'Node 7' },
        { name: 'Node 8', source: 'Node 4', target: 'Node 8' },
    ];

    private timelineData = [];

    constructor() {
    }

    getGridCoordinates() {
        return this.gridCoordinates;
    }

    getGridLinks() {
        return this.gridLinks;
    }

    setVoltage(nodesNumber) {
        for (let node = 0; node < nodesNumber; node++) {
            const tempTimelineData = [];
            for (let hour = 0; hour < 24; hour++) {
                tempTimelineData.push(
                    {
                        hour: hour + 1,
                        voltage: Math.round(Math.random() * 100 + 1),
                        lineLoad: Math.round(Math.random() * 100 + 1),
                    },
                );
            }
            this.timelineData.push(tempTimelineData);
        }
    }

    getVoltage() {
        return this.timelineData;
    }
}
