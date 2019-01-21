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

    ngOnChanges(changes: SimpleChanges) {
        this.afterDataRecieved(changes.data.currentValue);
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
            for (const obj of ObjHeaders) {
                headers = [...headers, ObjHeaders[obj][0]];
            }

            let series: any = [];
            const tempArr = [];
            for (let index = 0; index < headers.length; index++) {
                tempArr[index] = csvData[index][1];
            }

            series = [
                {
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                const colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
                                ];
                                return colorList[params.dataIndex];
                            },
                        },
                    },
                    data: tempArr,
                    type: 'bar',
                }];
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
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true,
                            title: 'Save',
                        },
                    },
                },
                legend: {
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                grid: {
                    right: '20%',

                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true,
                        },
                        data: headers,
                    },
                ],
                yAxis: [
                    {
                        name: 'Expenses and Revenues',
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        min: -100,
                        max: 250,
                        position: 'left',
                        axisLabel: {
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                    },
                    {
                        name: 'LCOE',
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                        min: 70,
                        max: 120,
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
