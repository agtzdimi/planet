import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-simulation-bar',
    template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class SimulationsBarComponent implements OnDestroy, OnChanges {

    @Input() data;
    @Input() yRightAxisLabel;
    @Input() yAxisLabel;
    @Input() yVal;

    ngOnChanges(changes: SimpleChanges) {
        this.afterDataRecieved(changes.data.currentValue);
    }

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService) {
    }

    comparator(a, b) {
        if (+a[1] > +b[1]) return -1;
        if (+a[1] < +b[1]) return 1;
        return 0;
    }

    afterDataRecieved(data) {

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
            let csvData = data;

            const colorList = [
                '#B5C334', '#C1232B', '#F0805A', '#E87C25', '#27727B',
                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                '#D7504B', '#C6E579', '#F4E001', '#FCCE10', '#26C0C0',
            ];

            const series: any = [];
            let stack = null;
            let yIndex: number;
            let barGap: string;
            let type: string;
            let barWidth = '135';
            const checkGraph = csvData.find(val => {
                if (val[0] === 'RES direct utilization' || val[0] === 'P2H heat') {
                    return true;
                } else {
                    return false;
                }
            });
            if (checkGraph) {
                csvData = csvData.sort(this.comparator);
                barGap = '-100%';
                barWidth = '185';
                yIndex = 0;
                type = 'bar';
                stack = 'stackBars';
            } else {
                this.yVal = null;
            }

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

            for (let index = 0; index < headers.length; index++) {
                csvData[index][1] = parseFloat(csvData[index][1]).toFixed(2);
                switch (headers[index]) {
                    case 'Total CO2 emissions':
                        type = 'scatter';
                        yIndex = 0;
                        barGap = '30%';
                        break;
                    case 'LCOE':
                        type = 'scatter';
                        yIndex = 1;
                        barGap = '30%';
                        break;
                    default:
                        type = 'bar';
                        yIndex = 0;
                        break;
                }
                const tempData = {
                    itemStyle: {
                        normal: {
                            color: colorList[index],
                        },
                    },
                    name: headers[index],
                    type: type,
                    barWidth: barWidth,
                    barGap: barGap,
                    yAxisIndex: yIndex,
                    symbolSize: [40, 40],
                    stack: stack,
                    data: [csvData[index][1], csvData[index][0]],
                };
                series.push(tempData);
            }
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
                    right: '10%',

                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            show: false,
                        },
                        data: [''],
                        axisLabel: {
                            color: 'white',
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'white',
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        id: 0,
                        max: this.yVal,
                        name: this.yAxisLabel,
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        position: 'left',
                        axisLabel: {
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                    },
                    {
                        id: 1,
                        name: this.yRightAxisLabel,
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        position: 'right',
                        axisLabel: {
                            textStyle: {
                                color: echarts.textColor,
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

}
