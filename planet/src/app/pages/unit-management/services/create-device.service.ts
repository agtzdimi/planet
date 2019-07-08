import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CreateDeviceService {

    constructor(private httpClient: HttpClient) { }

    public createNewDevice(metadata: Object, name, description, model) {

        return new Promise(resolve => {
            const url = '/planet/rest/add_device';
            const data = {
                'type': 'Resource',
                'unitType': model,
                'name': name,
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
                        'sub_topic': '/planet/GetData',
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
