import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../env.service';

@Injectable()
export class CreateDeviceService {

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }


    public createNewDevice(data: Object, jwtToken: string) {

        return new Promise(resolve => {
            const url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/api/devices';
            this.httpClient.post(url, data, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-SiteWhere-Tenant-Id': 'Planet',
                    'X-SiteWhere-Tenant-Auth': 'Planet1234',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
                    'Access-Control-Allow-Credentials': 'true',
                }),
            })
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