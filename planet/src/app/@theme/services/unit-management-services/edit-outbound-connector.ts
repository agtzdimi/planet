import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../env.service';

@Injectable()
export class EditOutboundConnService {

    index: number;
    hostnameAttr: number;
    portAttr: number;
    connectors;

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }

    public editOutBoundConnector(data: Object, jwtToken: string) {

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
                        // index 1 holds outbound connectors
                        this.connectors = res;
                        if (data['isSimulator']) {
                            this.getIndexes(res, 'Get' + data['token']);
                            this.setConnectors(data['ip'], data['port']);
                            this.getIndexes(res, 'Send' + data['token']);
                            this.setConnectors(data['ip'], data['port']);
                        } else {
                            this.getIndexes(res, data['token']);
                            this.setConnectors(data['ip'], data['port']);
                        }

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

                        resolve('Device was successfully updated!');
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }

    getIndexes(res, name) {
        res['children'][1]['children'].find((obj, idx) => {
            for (let attr = 0; attr < obj['attributes'].length; attr++) {
                if (obj['attributes'][attr]['value'] === name &&
                    obj['attributes'][attr]['name'] === 'connectorId') {
                    this.index = idx;
                } else if (obj['attributes'][attr]['name'] === 'hostname') {
                    this.hostnameAttr = attr;
                } else if (obj['attributes'][attr]['name'] === 'port') {
                    this.portAttr = attr;
                }
            }
        });
    }

    setConnectors(ip, port) {
        this.connectors['children'][1]['children'][this.index]['attributes'][this.hostnameAttr]['value'] = ip;
        this.connectors['children'][1]['children'][this.index]['attributes'][this.portAttr]['value'] = port;
    }
}
