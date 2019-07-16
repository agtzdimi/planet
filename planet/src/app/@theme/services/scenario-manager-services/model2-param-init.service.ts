import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class Model2ParamInitService {

    paramUpdated = new EventEmitter<Object>();

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

                'node.2': {
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

                'node.3': {
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

                'node.4': {
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

                'node.5': {
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

                'node.6': {
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

                'node.7': {
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

                'node.8': {
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

            'updateState': true,
            'eventDate': '2018-21-07T15:40:03.391+02:00',
        },
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
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['CHP'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electric': 40,
                        'efficiency.thermal': 45,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['CHP'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electric': 40,
                        'efficiency.thermal': 45,
                    };
                }
                break;
            case 3:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['DH']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 3,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['DH']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 98,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['LHD']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 3,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['LHD']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 98,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['DH']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 3,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['DH']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 98,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['LHD']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 3,
                    };
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2H']['LHD']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 98,
                    };
                }
                break;
            case 4:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2G'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electrolysis': 75,
                        'efficiency.methanation': 80,
                        'efficiency.thermal': 24,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['P2G'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electrolysis': 75,
                        'efficiency.methanation': 80,
                        'efficiency.thermal': 24,
                    };
                }
                break;
            case 5:
                if (flag) {
                    this.paramInit['payload']['electric.grid'][displayingNode]['uncontrollable.load'] = {
                        'peak.load': 2000,
                    };
                } else {
                    this.paramInit['payload']['electric.grid'][displayingNode]['uncontrollable.load'] = {
                        'peak.load': 0,
                    };
                }
                break;
        }
        this.paramUpdated.emit(this.paramInit);
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
        this.paramUpdated.emit(this.paramInit);
    }

    changeModel(newModel) {
        this.paramInit = newModel;
    }


}