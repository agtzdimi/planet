import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { GridCoordinatesService } from '../../../services/gridCoordinates.service';

@Component({
    selector: 'ngx-simulation-nodes',
    providers: [GridCoordinatesService],
    template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class SimulationsNodesComponent implements OnDestroy, OnChanges {

    @Input() data;

    private gridCoordinates = [];
    private gridLinks = [];
    private timelineData = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.afterDataRecieved(changes.data.currentValue);
            this.setData();
        }
    }

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService,
        private gridService: GridCoordinatesService, ) {
        this.gridCoordinates = gridService.getGridCoordinates();
        this.gridLinks = gridService.getGridLinks();
        gridService.setVoltage(this.gridLinks.length),
            this.timelineData = gridService.getVoltage();
    }

    afterDataRecieved(dataFromCsv) {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;

            this.options = {
                timeline: {
                    axisType: 'value',
                    autoPlay: true,
                    playInterval: 2000,
                    controlStyle: {
                        position: 'left'
                    },
                    data: []
                },
                baseOption: {
                    title: { text: 'Electric Grid' },
                    tooltip: {},
                    series: [
                        {
                            id: 'ElectricGridGraph',
                            name: "Electric Grid",
                            type: 'graph',

                            layout: 'force', //'circular', 'force', 'node' (default)
                            //roam: 'zoom',
                            symbol: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'

                            focusNodeAdjacency: true,
                            //edgeSymbol: ['none', 'arrow'],
                            //edgeSymbolSize: 1000,

                            itemStyle: {
                                borderColor: 'black',
                                borderWidth: 0.3,
                                borderType: 'solid',
                                opacity: 1
                            },

                            lineStyle: {
                                type: 'solid', // 'solid', 'dashed', 'dotted'
                                opacity: 0.9,
                                curveness: 0
                            },

                            label: {
                                normal: {
                                    show: true,
                                    position: 'left',
                                    formatter: '{b}',
                                    color: 'auto',
                                    fontStyle: 'oblique'
                                }
                            },

                            edgeLabel: {
                                show: true,
                            },

                            left: 'center',
                            right: 'auto',
                            top: 'middle',
                            bottom: 'auto',

                            tooltip: {
                                position: 'right',
                                formatter: '{b}<br/>Voltage: {c}',
                                padding: [5, 10, 5, 10], // up, right, down, left
                            },

                            force: {
                                repulsion: 700,
                                initLayout: true,
                                //gravity: 1,
                                edgeLength: 30,
                                layoutAnimation: true
                            },

                        },
                    ]
                },
                options: []
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }

    getOption(i) {
        let series = [];
        let data = [];
        let links = [];

        for (let node = 0; node < this.gridCoordinates.length; node++) {
            data.push({
                name: this.gridCoordinates[node]['name'],
                //x: this.gridCoordinates[node]['x'],
                //y: this.gridCoordinates[node]['y'],
                value: this.timelineData[node][i]['voltage'],
            })
        }

        let widthRange = [1, 5];
        let min = this.timelineData[0][i]['lineLoad']
        let max = this.timelineData[0][i]['lineLoad']
        for (let node = 1; node < this.gridLinks.length; node++) {
            if (this.timelineData[node][i]['lineLoad'] < min) {
                min = this.timelineData[node][i]['lineLoad']
            }
            if (this.timelineData[node][i]['lineLoad'] > max) {
                max = this.timelineData[node][i]['lineLoad']
            }
        }

        for (let node = 0; node < this.gridLinks.length; node++) {
            let x = Math.round((widthRange[1] - widthRange[0]) * (this.timelineData[node][i]['lineLoad'] - min) / (max - min) + widthRange[0]);
            links.push({
                name: this.gridLinks[node]['name'],
                source: this.gridLinks[node]['source'],
                target: this.gridLinks[node]['target'],
                value: this.timelineData[node][i]['lineLoad'],
                lineLoad: this.timelineData[node][i]['lineLoad'],
                lineStyle: { width: x }
            })
        }

        series.push({
            data,
            links,
            symbolSize: function (v) {
                let symbolRange = [20, 40];
                let max = Math.max.apply(Math, data.map(function (o) { return o.value; }));
                let min = Math.min.apply(Math, data.map(function (o) { return o.value; }));
                // [a, b] => (b - a) * (x - min(x)) / (max(x) - min(x)) + a
                let x = Math.round((symbolRange[1] - symbolRange[0]) * (v - min) / (max - min) + symbolRange[0]);
                return x
            },
            itemStyle: {
                color: function (params) {
                    let max = Math.max.apply(Math, data.map(function (o) { return o.value; }));
                    return params.value > 0.8 * max ? '#c72c41' : 'lightgrey';
                },
            },
            edgeLabel: {
                formatter: function (params) {
                    return String(params.data.lineLoad) + " Line";
                },
            },

        });

        return {
            title: { subtext: 'Timestamp: ' + this.timelineData[0][i]['hour'] },
            series: series
        };
    }

    setData() {
        let timestamp = this.timelineData[0].map(function (o) { return o.hour; })

        for (let hour = 0; hour < timestamp.length; hour++) {
            this.options.options.push(this.getOption(hour));
            this.options.timeline.data.push(timestamp[hour]);
        }
    }

}
