import { Injectable } from '@angular/core';

@Injectable()
export class Model1ParamInitService {

    paramInit = {
        'file.name': 'Parameters_initialization',
        'payload': {

            'simulation': {
                'time.step': 0.25,
                'simulation.time': 96,
            },

            'electric.grid': {
                'node.1': {
                    'uncontrollable.load': {
                        'peak.load': 2000,
                    },
                    'PV': {
                        'nominal.electric.power': 0,
                    },

                    'WT': {
                        'nominal.electric.power': 0,
                    },

                    'CHP': {
                        'nominal.electric.power': 0,
                        'efficiency.electric': 40,
                        'efficiency.thermal': 45,
                    },

                    'P2H': {
                        'DH': {
                            'HP': {
                                'nominal.heat.power': 0,
                                'cop': 3,
                            },
                            'EH': {
                                'nominal.heat.power': 0,
                                'efficiency.thermal': 98,
                            },
                        },
                        'LHD': {
                            'HP': {
                                'nominal.heat.power': 0,
                                'cop': 3,
                            },
                            'EH': {
                                'nominal.heat.power': 0,
                                'efficiency.thermal': 98,
                            },
                        },
                    },

                    'P2G': {
                        'nominal.electric.power': 0,
                        'efficiency.electrolysis': 75,
                        'efficiency.methanation': 80,
                        'efficiency.thermal': 24,
                    },

                    'EB': {
                        'storage.electric.capacity': 0,
                        'efficiency.charge': 92.1,
                        'efficiency.discharge': 92.1,
                        'c.rate': 0.25,
                    },

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
        },
    };

    constructor() { }


}
