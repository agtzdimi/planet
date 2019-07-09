import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GetDeviceByTypeService {

    constructor(private httpClient: HttpClient) { }


    public getDeviceByType() {

        return new Promise(resolve => {
            const url = '/planet/rest/get_devices';
            this.httpClient.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve('Error: ' + error['error']);
                    },
                );
        });
    }
}
