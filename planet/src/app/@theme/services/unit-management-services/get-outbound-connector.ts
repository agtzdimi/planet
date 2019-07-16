import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../env.service';

@Injectable()
export class GetOutboundConnService {
    connector: any;

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }

    public getOutBoundConnector(unitName: Object, jwtToken: string) {

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
                        res['children'][1]['children'] = res['children'][1]['children'].find(obj => {
                            for (let attr = 0; attr < obj['attributes'].length; attr++) {
                                if (obj['attributes'][attr]['value'] === unitName) {
                                    this.connector = obj;
                                    return obj;
                                }
                            }
                            return null;
                        });
                        resolve(this.connector);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
