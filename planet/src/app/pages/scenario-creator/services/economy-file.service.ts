import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EconomyFileService {

    economyFileUpdated = new EventEmitter<Object>();

    economyFile = {
        'file.name': 'Economy_environment_initialization',
        'payload': {

            'NG.cost': 50,
            'SNG.cost': 50,
            'heat.cost': 45,
            'carbon.tax': 15,
            'NG.emission.factor': 0.2012,

            'technologies.cost': {
                'WT': {
                    'CAPEX': 1100,
                    'OPEX': 3.5,
                    'life.time': 25,
                },
                'PV': {
                    'CAPEX': 800,
                    'OPEX': 1.5,
                    'life.time': 30,
                },
                'CHP': {
                    'CAPEX': 900,
                    'OPEX': 3,
                    'life.time': 20,
                },
                'HP': {
                    'CAPEX': 2900,
                    'OPEX': 2,
                    'life.time': 20,
                },
                'EH': {
                    'CAPEX': 100,
                    'OPEX': 1,
                    'life.time': 20,
                },
                'EB': {
                    'CAPEX': 250,
                    'OPEX': 1,
                    'life.time': 15,
                },
                'P2G': {
                    'CAPEX': 750,
                    'OPEX': 2,
                    'life.time': 20,
                },
            },

            'updateState': true,
            'eventDate': '2018-21-07T15:40:03.391+02:00',
        },
    };

    constructor() { }

    updateDefaultValues(flag) {
        // Same values for future usage
        if (flag) {
            this.economyFile = {
                'file.name': 'Economy_environment_initialization',
                'payload': {

                    'NG.cost': 50,
                    'SNG.cost': 50,
                    'heat.cost': 45,
                    'carbon.tax': 15,
                    'NG.emission.factor': 0.2012,

                    'technologies.cost': {
                        'WT': {
                            'CAPEX': 1100,
                            'OPEX': 3.5,
                            'life.time': 25,
                        },
                        'PV': {
                            'CAPEX': 800,
                            'OPEX': 1.5,
                            'life.time': 30,
                        },
                        'CHP': {
                            'CAPEX': 900,
                            'OPEX': 3,
                            'life.time': 20,
                        },
                        'HP': {
                            'CAPEX': 2900,
                            'OPEX': 2,
                            'life.time': 20,
                        },
                        'EH': {
                            'CAPEX': 100,
                            'OPEX': 1,
                            'life.time': 20,
                        },
                        'EB': {
                            'CAPEX': 250,
                            'OPEX': 1,
                            'life.time': 15,
                        },
                        'P2G': {
                            'CAPEX': 750,
                            'OPEX': 2,
                            'life.time': 20,
                        },
                    },

                    'updateState': true,
                    'eventDate': '2018-21-07T15:40:03.391+02:00',
                },
            };
        } else {
            this.economyFile = {
                'file.name': 'Economy_environment_initialization',
                'payload': {

                    'NG.cost': 50,
                    'SNG.cost': 50,
                    'heat.cost': 45,
                    'carbon.tax': 15,
                    'NG.emission.factor': 0.2012,

                    'technologies.cost': {
                        'WT': {
                            'CAPEX': 1100,
                            'OPEX': 3.5,
                            'life.time': 25,
                        },
                        'PV': {
                            'CAPEX': 800,
                            'OPEX': 1.5,
                            'life.time': 30,
                        },
                        'CHP': {
                            'CAPEX': 900,
                            'OPEX': 3,
                            'life.time': 20,
                        },
                        'HP': {
                            'CAPEX': 2900,
                            'OPEX': 2,
                            'life.time': 20,
                        },
                        'EH': {
                            'CAPEX': 100,
                            'OPEX': 1,
                            'life.time': 20,
                        },
                        'EB': {
                            'CAPEX': 250,
                            'OPEX': 1,
                            'life.time': 15,
                        },
                        'P2G': {
                            'CAPEX': 750,
                            'OPEX': 2,
                            'life.time': 20,
                        },
                    },

                    'updateState': true,
                    'eventDate': '2018-21-07T15:40:03.391+02:00',
                },
            };
        }
        this.economyFileUpdated.emit(this.economyFile);
    }

    changeModel(newModel) {
        this.economyFile = newModel;
    }

}
