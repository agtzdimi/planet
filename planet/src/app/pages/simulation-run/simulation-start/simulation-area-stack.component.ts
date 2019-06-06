import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-simulation-area-stack',
    template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class SimulationsAreaStackComponent implements OnDestroy, OnChanges {

    @Input() data;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.afterDataRecieved(changes.data.currentValue);
        }
    }

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService) {
    }

    setData(type, name, data) {
        let markLine = null;
        if (name === 'Electric grid power flow') {
            markLine = {
                data: [
                    {
                        yAxis: 0.1,
                        label: {
                            show: true,
                            position: 'middle',
                            formatter: 'Electricity imported from external grid',
                        },
                        lineStyle: {
                            opacity: 0.7,
                        },
                    },
                    {
                        yAxis: -0.1,
                        label: {
                            show: true,
                            position: 'middle',
                            formatter: 'Reverse power flow',
                        },
                        lineStyle: {
                            opacity: 0.7,
                        },
                    },
                ],
            };
        }
        if (type === 'line') {
            return {
                name: name,
                type: 'line',
                data: data,
                markLine: markLine,
            };
        } else {
            return {
                name: name,
                type: 'line',
                areaStyle: { normal: { opacity: echarts.areaOpacity } },
                data: data,
            };
        }
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
            let name: string;

            for (let index = 0; index < headers.length; index++) {
                let tempData;
                switch (headers[index]) {
                    case 'Hours':
                        time = csvData[index];
                        break;
                    case 'Surplus':
                        name = 'Surplus';
                        tempData = this.setData('line', name, csvData[index]);
                        break;
                    case 'Electric_demand':
                        name = 'El. Dem';
                        tempData = this.setData('line', name, csvData[index]);
                        break;
                    case 'Electric_grid_power_flow':
                        name = 'Electric grid power flow';
                        for (let val = 0; val < csvData[index].length; val++) {
                            csvData[index][val] = parseFloat(csvData[index][val]).toFixed(6);
                        }
                        tempData = this.setData('line', name, csvData[index]);
                        break;
                    case 'Total_heat_demand':
                        name = 'Total heat demand';
                        tempData = this.setData('line', name, csvData[index]);
                        break;
                    case 'RES_power':
                        name = 'RES Producibility';
                        tempData = this.setData('line', name, csvData[index]);
                        break;
                    case 'RES_direct_utilization':
                        name = 'From RES';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'EB_output':
                        name = 'From EB';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'P2H_heat':
                        name = 'From P2H';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'CHP_heat':
                        name = 'From CHP';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'P2G_heat':
                        name = 'From P2G';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'G2H_heat':
                        name = 'From G2H';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'CHP_el_production':
                        name = 'From CHP';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'P2H_input':
                        name = 'To P2H';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'EB_input':
                        name = 'To EB';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'P2G_input':
                        name = 'To P2G';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                    case 'RES_Curtailment':
                        name = 'Curtailment';
                        tempData = this.setData('area', name, csvData[index]);
                        break;
                }
                headers[index] = name;
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
                    handleIcon: `M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h
1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z`,
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
                            textStyle: {
                                color: echarts.textColor,
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
