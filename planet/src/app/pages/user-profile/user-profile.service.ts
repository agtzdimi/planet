import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../env.service';

@Injectable()
export class UserProfileService {
    message: string = '';

    constructor(private httpClient: HttpClient,
        private env: EnvService) {
    }

    public uploadImage(image, email, name): Promise<any> {
        return new Promise(resolve => {
            const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/update_user';
            this.httpClient.post<HttpResponse<Object>>(url, {
                image: image,
                email: email,
                name: name,
            })
                .subscribe(
                    data => {
                        const event = new CustomEvent(
                            'ImageEvent',
                            { detail: { 'image': data['data']['image'], 'token': data['data']['token'] } });
                        document.dispatchEvent(event);
                    },
                    error => {
                        // console.log(error)
                    },
                );
        });
    }
}


