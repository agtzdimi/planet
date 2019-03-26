import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ipJson from '../../../../assets/data//planet_IPs.json';

@Injectable()
export class EditDeviceService {

    constructor(private httpClient: HttpClient) { }


    public editDevice(jwtToken: string, data, token) {

        return new Promise(resolve => {
            const url = 'http://' + ipJson['sitewhere'] + ':8080/sitewhere/api/devices' + token;
            this.httpClient.put(url, data, {
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
                params: {
                    'deviceToken': token,
                },
            })
                .subscribe(
                    res => {
                        resolve('Device Successfully Updated!');
                    },
                    error => {
                        // console.log(error)
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
