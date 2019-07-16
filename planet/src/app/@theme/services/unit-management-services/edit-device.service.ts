import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EditDeviceService {

    constructor(private httpClient: HttpClient) { }

    public editDevice(devices, data, name, descr, ip, port) {
        devices = devices['results']['resources'].filter((val) => {
            return val['name'] === name;
        });
        devices[0]['metadata'] = data;
        devices[0]['IP'] = ip;
        devices[0]['Port'] = port;
        devices[0]['description'] = descr;
        return new Promise(resolve => {
            const url = '/planet/rest/edit_device';
            this.httpClient.post(url, devices)
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
