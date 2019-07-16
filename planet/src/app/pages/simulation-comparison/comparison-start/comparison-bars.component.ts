import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-comparison-bars',
    template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class ComparisonBarsComponent implements OnDestroy, OnChanges {

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
                '#C1232B', '#B5C334', '#F0805A', '#26C0C0', '#27727B',
                '#FCCE10', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                '#D7504B', '#C6E579', '#F4E001', '#FE8463', '#E87C25',
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
                barWidth = '185';
                yIndex = 0;
                type = 'bar';
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
            const stacks = [];
            for (const obj of Object.keys(ObjHeaders)) {
                headers = [...headers, ObjHeaders[obj][0]];
            }
            let yAxis;
            let color = '';
            let check = -1;
            for (let index = 0; index < headers.length; index++) {
                csvData[index][1] = parseFloat(csvData[index][1]).toFixed(2);
                switch (headers[index]) {
                    case 'Total CO2 emissions':
                        type = 'scatter';
                        yIndex = 0;
                        barGap = '0%';
                        yAxis = csvData[index][2];
                        if (!stacks.includes(yAxis)) {
                            stacks.push(yAxis);
                        }
                        check = series.findIndex(x => x.name === headers[index]);
                        if (check !== -1) {
                            color = series[check]['itemStyle']['normal']['color'];
                        } else {
                            color = colorList[index];
                        }
                        break;
                    case 'LCOE':
                        type = 'scatter';
                        yIndex = 1;
                        barGap = '0%';
                        yAxis = csvData[index][2];
                        if (!stacks.includes(yAxis)) {
                            stacks.push(yAxis);
                        }
                        check = series.findIndex(x => x.name === headers[index]);
                        if (check !== -1) {
                            color = series[check]['itemStyle']['normal']['color'];
                        } else {
                            color = colorList[index];
                        }
                        break;
                    case 'RES curtailment':
                    case 'RES to P2H':
                    case 'RES to P2G':
                    case 'RES direct utilization':
                    case 'CHP el production':
                    case 'Imported electricity':
                    case 'G2H heat':
                    case 'P2H heat':
                    case 'P2G heat':
                    case 'CHP heat':
                        barGap = '30%';
                        stack = csvData[index][2];
                        if (!stacks.includes(stack)) {
                            stacks.push(stack);
                        }
                        check = series.findIndex(x => x.name === headers[index]);
                        if (check !== -1) {
                            color = series[check]['itemStyle']['normal']['color'];
                        } else {
                            color = colorList[index];
                        }
                        break;
                    default:
                        type = 'bar';
                        yIndex = 0;
                        barGap = '0%';
                        yAxis = csvData[index][2];
                        if (!stacks.includes(yAxis)) {
                            stacks.push(yAxis);
                        }
                        check = series.findIndex(x => x.name === headers[index]);
                        if (check !== -1) {
                            color = series[check]['itemStyle']['normal']['color'];
                        } else {
                            color = colorList[index];
                        }
                        break;
                }
                const tempData = {
                    itemStyle: {
                        normal: {
                            color: color,
                        },
                    },
                    name: headers[index],
                    type: type,
                    barWidth: barWidth,
                    barGap: barGap,
                    yAxisIndex: yIndex,
                    symbolSize: [40, 40],
                    stack: stack,
                };
                let axisLabel;
                if (stack) {
                    tempData['barGap'] = '-100%';
                    axisLabel = stack;
                } else {
                    axisLabel = yAxis;
                }
                const tempIndex = stacks.indexOf(axisLabel);
                tempData['data'] = [];
                for (let i = 0; i < stacks.length; i++) {
                    if (i === tempIndex) {
                        tempData['data'].push(csvData[index][1]);
                        tempData['data'].push(csvData[index][0]);
                    } else {
                        tempData['data'].push(null);
                    }
                }
                series.push(tempData);
            }
            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.warningLight, colors.infoLight, colors.dangerLight,
                colors.successLight, colors.primaryLight],
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        const colorSpan = itemColor =>
                            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
                            + itemColor + '"></span>';
                        let rez = '<p>' + params[0].axisValue + '</p>';
                        params.forEach(item => {
                            if (item.seriesName !== item.data && item.data) {
                                const xx = '<p>' + colorSpan(item.color) + ' ' + item.seriesName + ': ' + item.data + '</p>';
                                rez += xx;
                            }
                        });
                        return rez;
                    },
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
                    iconStyle: {
                        color: '#d9e4ff',
                    },
                    emphasis: {
                        iconStyle: {
                            color: '#598bff',
                        },
                    },
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
                        data: stacks,
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
