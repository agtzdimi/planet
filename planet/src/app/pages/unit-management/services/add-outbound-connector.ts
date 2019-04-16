import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../env.service';

@Injectable()
export class AddOutboundConnService {

    connectors = {};

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }


    public addOutBoundConnector(data: Object, jwtToken: string) {

        return new Promise(resolve => {
            const url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort +
                '/sitewhere/api/instance/microservice/outbound-connectors/tenants/Planet/configuration';
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken,
                'X-Requested-With': 'XMLHttpRequest',
                'X-SiteWhere-Tenant-Id': 'Planet',
                'X-SiteWhere-Tenant-Auth': 'Planet1234',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
                'Access-Control-Allow-Credentials': 'true',
            });

            this.httpClient.get(url, {
                headers: headers,
            })
                .subscribe(
                    res => {
                        this.connectors = {
                            'name': 'mqtt-connector',
                            'attributes': [
                                {
                                    'name': 'connectorId',
                                    'value': 'planetOutbound2',
                                }, {
                                    'name': 'hostname',
                                    'value': '160.40.49.244',
                                }, {
                                    'name': 'numProcessingThreads',
                                    'value': '5',
                                }, {
                                    'name': 'port',
                                    'value': '1883',
                                }, {
                                    'name': 'protocol',
                                    'value': 'tcp',
                                }, {
                                    'name': 'topic',
                                    'value': 'P2GG',
                                },
                            ],
                        };
                        // index 1 holds outbound connectors
                        res['children'][1]['children'].push(this.connectors);
                        this.httpClient.post(url, res, {
                            headers: headers,
                        })
                            .subscribe(
                                results => {
                                    resolve(results);
                                },
                                err => {
                                    resolve('Error: ' + err['error']);
                                },
                            );

                        resolve('Device was successfully created!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
