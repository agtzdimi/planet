import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DeleteDeviceService {

    constructor(private httpClient: HttpClient) { }


    public deleteDevice(jwtToken: string, token) {

        return new Promise(resolve => {
            const url = 'http://130.192.180.234:8080/sitewhere/api/devices/' + token;
            this.httpClient.delete(url, {
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
                        resolve('Device Successfully Deleted!');
                    },
                    error => {
                        // console.log(error)
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
