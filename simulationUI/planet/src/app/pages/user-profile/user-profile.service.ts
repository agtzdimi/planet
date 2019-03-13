import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@nebular/auth';

@Injectable()
export class UserProfileService {
    message: string = '';

    constructor(private httpClient: HttpClient, private authService: NbAuthService) { }


    public uploadImage(image, email, name): Promise<any> {
        return new Promise(resolve => {
            this.httpClient.post<HttpResponse<Object>>('http://160.40.49.244:8000/update_user', {
                image: image,
                email: email,
                name: name,
            })
                .subscribe(
                    data => {
                        this.authService.refreshToken('email').subscribe((result: NbAuthResult) => {
                            // console.log(result)
                        });
                    },
                    error => {
                        // console.log(error)
                    },
                );
        });
    }
}


