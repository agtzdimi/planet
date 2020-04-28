import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TurinGridInitService {

    paramUpdated = new Subject<Object>();

    paramInit = {
        'file.name': 'Parameters_initialization',
        'payload': {
            'formName': '',
            'formDescription': '',

            'simulation': {
                'time.step': 15,
                'simulation.time': 24,
            },

            'electric.grid': {
                'node.1': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.1',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.2': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.2',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.3': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.3',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.4': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.4',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.5': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.5',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.6': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.6',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.7': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.7',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.8': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.8',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.9': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.9',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.10': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.10',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.11': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.11',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.12': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.12',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.13': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.13',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.14': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.14',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.15': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.15',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.16': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.16',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.17': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.17',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.18': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.18',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.19': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.19',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.20': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.20',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.21': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.21',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.22': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.22',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.23': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.23',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.24': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.24',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.25': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.25',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.26': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.26',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.27': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.27',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.28': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.28',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.29': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.29',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.30': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.30',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.31': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.31',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.32': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.32',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.33': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.33',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.34': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.34',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.35': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.35',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.36': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.36',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.37': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.37',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.38': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.38',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.39': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.39',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.40': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.40',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.41': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.41',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.42': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.42',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
                'node.43': {
                    'activated': true,
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'P2H': {

                    },

                    'P2G': {

                    },

                    'VES': {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.43',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    },

                },
            },
            'eNetworkParams': {
                'networkLocation': 'TURIN',
                'networkId': 1,
                'voltage_base': {
                    'unit': 'kV',
                    'value': 22,
                },
            },
            'eNetworkConstraints': {
                'loading_max': [340, 340, 340, 265, 265, 315, 315, 340],
                'length_of_lines': [1, 1, 1, 1, 1, 1, 1, 1],
                'voltageMaxLimit': [1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
                'voltageMinLimit': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
            },
            'eNetworkGraphStructure': {
                'incident_matrix': [
                    [-1, 0, 0, 0, 0, 0, 0, 0],
                    [1, -1, 0, 0, 0, 0, 0, 0],
                    [0, 1, -1, 0, 0, 0, 0, 0],
                    [0, 0, 1, -1, 0, 0, 0, 0],
                    [0, 0, 0, 1, -1, 0, 0, 0],
                    [0, 0, 0, 0, 1, -1, 0, 0],
                    [0, 0, 0, 0, 0, 1, -1, 0],
                    [0, 0, 0, 0, 0, 0, 1, -1],
                ],
                'length_of_lines': [1, 1, 1, 1, 1, 1, 1, 1],
            },
        },

        'centralised.heat': {
            'uncontrollable.load': {
                'peak.load': 1500,
            },
            'G2H': {
                'nomial.heat.power': 1000,
                'efficiency.thermal': 90,
            },
        },

        'localised.heat': {
            'uncontrollable.load': {
                'peak.load': 1500,
            },
            'G2H': {
                'nomial.heat.power': 1500,
                'efficiency.thermal': 90,
            },
        },
        'owner': 'admin',
        'eventDate': '2018-21-07T15:40:03.391+02:00',
    };

    constructor() { }

    updateDefaultValues(id, flag, displayingNode) {
        switch (id) {
            case 0:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['PV'] = {
                        'nominal.electric.power': 100,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['PV'] = {
                        'nominal.electric.power': 0,
                    };
                }
                break;
            case 1:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['WT'] = {
                        'nominal.electric.power': 0,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['WT'] = {
                        'nominal.electric.power': 0,
                    };
                }
                break;
            case 2:

                break;
            case 3:

                break;
            case 4:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['VES'] = {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.1',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['VES'] = {
                        'VESPortfolioID': 'VESPortfolio1',
                        'nodeID': 'node.1',
                        'simulationID': '',
                        'consumptionUnits': 'Watt',
                        'consumptions': [16800],
                        'parameters': {
                            'optimalityPolyNom': '[0,1,1]',
                            'timeStamp': 1586419400,
                            'noSteps': 1,
                            'noResidentialBuildings': 100,
                            'noCommercialBuildings': 150,
                            'tOutForecast': [15, 13],
                            'CAPEX': '',
                            'OPEX': '',
                            'constraints': {
                                'ramp_up_lim': 0.5,
                                'ramp_down_lim': 0.5,
                                'FLH': '',
                            },
                        },
                    };
                }
        }
        this.paramUpdated.next(this.paramInit);
    }

    updateG2HValues(id, flag) {
        switch (id) {
            case 1:
                if (flag) {
                    this.paramInit['payload']['centralised.heat']['uncontrollable.load'] = {
                        'peak.load': 1500,
                    };
                } else {
                    this.paramInit['payload']['centralised.heat']['uncontrollable.load'] = {
                        'peak.load': 0,
                    };
                }
                break;
            case 2:
                if (flag) {
                    this.paramInit['payload']['centralised.heat']['G2H'] = {
                        'nomial.heat.power': 1000,
                        'efficiency.thermal': 90,
                    };
                } else {
                    this.paramInit['payload']['centralised.heat']['G2H'] = {
                        'nomial.heat.power': 0,
                        'efficiency.thermal': 90,
                    };
                }
                break;
            case 3:
                if (flag) {
                    this.paramInit['payload']['localised.heat']['uncontrollable.load'] = {
                        'peak.load': 1500,
                    };
                } else {
                    this.paramInit['payload']['localised.heat']['uncontrollable.load'] = {
                        'peak.load': 0,
                    };
                }
                break;
            case 4:
                if (flag) {
                    this.paramInit['payload']['localised.heat']['G2H'] = {
                        'nomial.heat.power': 1500,
                        'efficiency.thermal': 90,
                    };
                } else {
                    this.paramInit['payload']['localised.heat']['G2H'] = {
                        'nomial.heat.power': 0,
                        'efficiency.thermal': 90,
                    };
                }
                break;
        }
        this.paramUpdated.next(this.paramInit);
    }

    changeModel(newModel) {
        this.paramInit = newModel;
    }


}
