import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../env.service';

@Injectable()
export class DeleteDeviceService {

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }


    public deleteDevice(jwtToken: string, token) {

        return new Promise(resolve => {
            let url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/api/assignments/';
            let assignmentToken;
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
                params: {
                    'deviceToken': token,
                },
            })
                .subscribe((assignments) => {
                    assignmentToken = assignments['results'][0]['token'];
                    url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/api/assignments/' + assignmentToken;
                    assignments['results'][0]['status'] = 'Released';
                    this.httpClient.put(url, assignments, {
                        headers: headers,
                        params: {
                            'token': assignmentToken,
                        },
                    })
                        .subscribe(
                            res => {
                                url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/api/assignments/' +
                                    assignmentToken;
                                this.httpClient.delete(url, {
                                    headers: headers,
                                    params: {
                                        'token': assignmentToken,
                                    },
                                })
                                    .subscribe(
                                        asments => {
                                            // console.log(asments)
                                        },
                                        error => {
                                            // console.log(error)
                                        },
                                    );

                                url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/api/devices/' + token;
                                this.httpClient.delete(url, {
                                    headers: headers,
                                    params: {
                                        'deviceToken': token,
                                    },
                                })
                                    .subscribe(
                                        devices => {
                                            resolve('Device Successfully Deleted!');
                                        },
                                        error => {
                                            // console.log(error)
                                            resolve('Error: ' + error['error']);
                                        },
                                    );
                            },
                            error => {
                                // console.log(error)
                            },
                        );


                });


        });
    }
}
