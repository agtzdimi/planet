import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CreateDeviceService {

    constructor(private httpClient: HttpClient) { }

    public createNewDevice(metadata: Object, name, description, model, ip, port) {

        return new Promise(resolve => {
            const url = '/planet/rest/add_device';
            let subTopic = name;
            if (model === 'Sim') {
                subTopic = '/planet/GetData';
            } else {
                subTopic = '/planet/Get' + name;
            }
            const data = {
                'type': 'Resource',
                'unitType': model,
                'name': name,
                'IP': ip,
                'Port': port,
                'description': description,
                metadata,
                'agent': {
                    'type': 'service',
                    'dir': null,
                    'exec': 'agent-examples/mqtt-switch/switch.sh',
                },
                'representation': {},
                'protocols': [
                    {
                        'type': 'MQTT',
                        'methods': [
                            'PUB',
                            'SUB',
                        ],
                        'content-types': [
                            'text/plain',
                        ],
                        'pub_topic': name,
                        'sub_topic': subTopic,
                    },
                    {
                        'type': 'REST',
                        'methods': [
                            'GET',
                            'POST',
                            'PUT',
                        ],
                        'content-types': [
                            'text/plain',
                        ],
                    },
                ],
            };

            this.httpClient.post(url, data)
                .subscribe(
                    res => {
                        resolve('Device was successfully created!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
