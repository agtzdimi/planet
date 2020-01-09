import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { GridCoordinatesService } from '../../../services/gridCoordinates.service';

import 'mapbox-echarts';

@Component({
    selector: 'ngx-simulation-nodes',
    providers: [GridCoordinatesService],
    template: `
    <div echarts [options]="options" class="echarts"></div>
  `,
})
export class SimulationsNodesComponent implements OnInit, OnDestroy, OnChanges {

    @Input() data;

    // Graph Data
    private gridData = [];
    private gridLinks = [];
    private gridCoords = [];

    // Echarts options
    options: any = [];
    coords = [];
    links = [];

    themeSubscription: any;

    constructor(gridService: GridCoordinatesService) {
        // Grid coordinates and the links between them (Graph's nodes and edges)
        this.gridLinks = gridService.getGridLinks();
        this.gridCoords = gridService.getGridCoordinates();

        // Calculate dummy values (TODO: read the values from a file)
        gridService.setVoltage(this.gridLinks.length);
        this.gridData = gridService.getVoltage();
    }

    ngOnInit() {
        this.initializeGraph();
        this.setData();

    }

    ngOnChanges(changes: SimpleChanges) {
        // if (changes.data.currentValue) {
        //     this.afterDataRecieved(changes.data.currentValue);
        // }
    }


    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }

    initializeGraph() {
        this.options = {
            // Timeline Element
            timeline: {
                axisType: 'value',
                autoPlay: false,
                playInterval: 2000,
                controlStyle: { position: 'left' },
                data: [],
            },

            // Echarts base options
            baseOption: {
                title: { text: 'Electric Grid' },
                tooltip: {},
                animation: false,
                tmap: {
                    center: [7.6000496, 45.0702388], // Starting Position [lng, lat] (default: Turin)
                    zoom: 9,
                    roam: true,
                    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
                },

                // Base options of all series
                series: [
                    {
                        id: 'ElectricGridGraph',
                        name: 'Electric Grid',
                        type: 'graph',

                        coordinateSystem: 'tmap',

                        // layout: 'force', //'circular', 'force', 'node' (default)
                        // roam: true, //'zoom',
                        symbol: 'circle', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'

                        focusNodeAdjacency: true,
                        // edgeSymbol: ['none', 'arrow'],
                        // edgeSymbolSize: 1000,

                        itemStyle: {
                            borderColor: 'black',
                            borderWidth: 0.3,
                            borderType: 'solid',
                            opacity: 1,
                        },

                        lineStyle: {
                            color: 'black',
                            type: 'solid', // 'solid', 'dashed', 'dotted'
                            opacity: 0.8,
                            curveness: 0,
                        },

                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                formatter: '{b}',
                                color: 'auto',
                                fontStyle: 'oblique',
                            },
                        },

                        edgeLabel: {
                            show: true,
                        },

                        left: 'center',
                        right: 'auto',
                        top: 'middle',
                        bottom: '100',

                        tooltip: {
                            position: 'right',
                            formatter: function (params) {
                                let label = 'NaN';
                                if (params.dataType === 'node') {
                                    label = 'Name: ' + params.name + '<br/>' +
                                        'lng: ' + params.value[0] + '<br/>' +
                                        'lan: ' + params.value[1] + '<br/>' +
                                        'Power: ' + params.value[2];
                                } else {
                                    label = 'Line: ' + params.value;
                                }

                                return label;
                            }, // '{b}<br/>Voltage: {@2}',
                            padding: [5, 10, 5, 10], // up, right, down, left

                            // force: {
                            //   repulsion: 7000,
                            //   initLayout: false,
                            //   //gravity: 0.1,
                            //   edgeLength: 400,
                            //   layoutAnimation: false
                            // },
                        },
                    },
                ],
            },

            // Base options of the echart
            options: [],
        };
    }

    setData() {
        const timestamp = this.gridData[0].map(function (o) { return o.hour; });

        for (let hour = 0; hour < timestamp.length; hour++) {
            this.options.options.push(this.getOption(hour));
            this.options.timeline.data.push(timestamp[hour]);
        }
    }

    getOption(i) {
        const series = [];
        const data = [];
        const links = [];

        for (let node = 0; node < this.gridCoords.length; node++) {
            data.push({
                name: this.gridCoords[node]['name'],
                value: [this.gridCoords[node]['x'], this.gridCoords[node]['y'], this.gridData[node][i]['voltage']],
            });
        }

        const widthRange = [1, 5];
        let min = this.gridData[0][i]['lineLoad'];
        let max = this.gridData[0][i]['lineLoad'];
        for (let node = 1; node < this.gridLinks.length; node++) {
            if (this.gridData[node][i]['lineLoad'] < min) {
                min = this.gridData[node][i]['lineLoad'];
            }
            if (this.gridData[node][i]['lineLoad'] > max) {
                max = this.gridData[node][i]['lineLoad'];
            }
        }

        for (let node = 0; node < this.gridLinks.length; node++) {
            const x = Math.round((widthRange[1] - widthRange[0]) * (this.gridData[node][i]['lineLoad'] - min) / (max - min) + widthRange[0]);
            links.push({
                name: this.gridLinks[node]['name'],
                source: this.gridLinks[node]['source'],
                target: this.gridLinks[node]['target'],
                value: this.gridData[node][i]['lineLoad'],
                lineLoad: this.gridData[node][i]['lineLoad'],
                lineStyle: { width: x },
            });
        }
        series.push({
            data,
            links,
            symbolSize: function (v) {
                const symbolRange = [10, 30];
                const max = Math.max.apply(Math, data.map(function (o) { return o.value[2]; }));
                const min = Math.min.apply(Math, data.map(function (o) { return o.value[2]; }));
                // [a, b] => (b - a) * (x - min(x)) / (max(x) - min(x)) + a
                const x = Math.round((symbolRange[1] - symbolRange[0]) * (v[2] - min) / (max - min) + symbolRange[0]);
                return x;
            },
            itemStyle: {
                color: function (params) {
                    const max_value = Math.max.apply(Math, data.map(function (o) { return o.value[2]; }));
                    return params.value[2] > 0.8 * max_value ? '#c72c41' : 'darkgrey';
                },
            },
            edgeLabel: {
                formatter: function (params) {
                    return String(params.data.lineLoad) + ' Line';
                },
            },

        });

        return {
            title: { subtext: 'Timestamp: ' + this.gridData[0][i]['hour'] },
            series: series,
        };
    }

    afterDataRecieved(dataFromCsv) {
        this.setData();
    }




}
