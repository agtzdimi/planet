import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-simulation-line',
    template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class SimulationsLineComponent implements OnDestroy, OnChanges {

    @Input() data;
    markArea;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.afterDataRecieved(changes.data.currentValue);
        }
    }

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService) {
    }

    afterDataRecieved(data) {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
            const csvData = data;
            const ObjHeaders = csvData.map((val) => {
                const res = val.filter((v, index) => {
                    if (index === 0) {
                        return v;
                    }
                });
                return res;
            });

            let headers = [];
            for (const obj of Object.keys(ObjHeaders)) {

                headers = [...headers, ObjHeaders[obj][0]];
            }
            const series: any = [];
            let time;

            for (let index = 0; index < headers.length; index++) {
                for (let val = 0; val < csvData[index].length; val++) {
                    if (headers[index] !== 'Hours') {
                        csvData[index][val] = parseFloat(csvData[index][val]).toFixed(2);
                    }
                }
                let tempData;
                switch (headers[index]) {
                    case 'Hours':
                        time = csvData[index];
                        time.splice(-1, 1);
                        break;
                    default:
                        csvData[index].splice(-1, 1);
                        tempData = {
                            name: headers[index],
                            type: 'line',
                            smooth: true,
                            data: csvData[index],
                        };
                        series.push(tempData);
                        break;
                }
            }

            const maxValue = Math.max.apply(Math, series.map(function (arrVal) {
                let max = Number.MIN_VALUE;
                for (let arr = 0; arr < arrVal['data'].length; arr++) {
                    if (+arrVal['data'][arr] > max) {
                        max = +arrVal['data'][arr];
                    }
                }
                return max;
            }));

            const minValue = Math.min.apply(Math, series.map(function (arrVal) {
                let min = Number.MAX_VALUE;
                for (let arr = 0; arr < arrVal['data'].length; arr++) {
                    if (+arrVal['data'][arr] < min) {
                        min = +arrVal['data'][arr];
                    }
                }
                return min;
            }));

            series.push(this.calculateMarkArea(minValue, true));
            series.push(this.calculateMarkArea(maxValue, false));

            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.warningLight, colors.infoLight, colors.dangerLight,
                colors.successLight, colors.primaryLight],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: echarts.tooltipBackgroundColor,
                        },
                    },
                },
                legend: {
                    data: headers,
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            title: 'Data View',
                            readOnly: 'true',
                            lang: ['Data View', 'Close', 'Refresh'],
                        },
                        saveAsImage: {
                            show: true,
                            title: 'Save',
                        },
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                dataZoom: [{
                    type: 'inside',
                    show: true,
                    start: 0,
                    end: 25,
                }, {
                    start: 0,
                    end: 25,
                    handleIcon: `M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4
v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z`,
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2,
                    },
                }],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: time,
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        axisLabel: {
                            color: 'white',
                            textStyle: {
                                color: 'white',
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        name: 'MW',
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: echarts.splitLineColor,
                            },
                        },
                        axisLabel: {
                            color: 'white',
                            textStyle: {
                                color: 'white',
                            },
                        },
                    },
                ],
                series,
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }

    calculateMarkArea(value, aboveZero) {
        if (aboveZero) {
            if (value > 0) {
                value = 0;
            }
            return {
                type: 'line',
                smooth: true,
                markArea: {
                    silent: true,
                    data: [
                        [
                            {
                                yAxis: -0,
                                label: {
                                    show: true,
                                    position: ['50%', '50%'],
                                    formatter: 'Reverse power flow',
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(38, 194, 129, 1)',
                                        borderColor: '#CE1C08',
                                        borderWidth: 1,
                                        borderType: 'dotted',
                                    },
                                },
                            },
                            {
                                yAxis: value,
                            },
                        ],
                    ],
                },
            };
        } else {
            if (value < 0) {
                value = 0;
            }
            return {
                type: 'line',
                smooth: true,
                markArea: {
                    silent: true,
                    data: [
                        [
                            {
                                yAxis: 0,
                                label: {
                                    show: true,
                                    position: ['50%', '50%'],
                                    formatter: 'Power imported from the grid',
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(231, 76, 60, 1)',
                                        borderColor: '#CE1C08',
                                        borderWidth: 1,
                                        borderType: 'dotted',
                                    },
                                },
                            },
                            {
                                yAxis: value,
                            },
                        ],
                    ],
                },
            };
        }
    }
}
