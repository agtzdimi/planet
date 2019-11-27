import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EconomyFileService {

    economyFileUpdated = new Subject<Object>();

    economyFile = {
        'file.name': 'Economy_environment_initialization',
        'payload': {
            'external.electricity.price': 100,
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
                'VES': {
                    'CAPEX': 800,
                    'OPEX': 1,
                },
            },
        },
    };

    constructor() { }

    updateDefaultValues(flag) {
        // Same values for future usage
        if (flag) {
            this.economyFile = {
                'file.name': 'Economy_environment_initialization',
                'payload': {
                    'external.electricity.price': 100,
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
                        'VES': {
                            'CAPEX': 800,
                            'OPEX': 1,
                        },
                    },
                },
            };
        } else {
            this.economyFile = {
                'file.name': 'Economy_environment_initialization',
                'payload': {
                    'external.electricity.price': 100,
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
                        'VES': {
                            'CAPEX': 800,
                            'OPEX': 1,
                        },
                    },
                },
            };
        }
        this.economyFileUpdated.next(this.economyFile);
    }

    changeModel(newModel) {
        this.economyFile = newModel;
    }

}
