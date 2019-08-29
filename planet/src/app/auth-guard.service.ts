import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: NbAuthService,
        private router: Router) {
    }

    canActivate() {
        return this.authService.isAuthenticated()
            .pipe(
                tap(authenticated => {
                    if (!authenticated) {
                        this.router.navigate(['auth/login']);
                    } else if (authenticated) {
                        this.authService.onTokenChange()
                            .subscribe((token: NbAuthJWTToken) => {
                                if (token.isValid()) {
                                    if (!token['payload']['isAdmin']) {
                                        this.router.events.subscribe((url: any) => {
                                            if (url['url'] === '/pages/system-params' || url['url'] === '/pages/user-administration') {
                                                this.router.navigateByUrl('/pages/welcome-screen');
                                            }
                                        });
                                    }
                                }
                            });
                    }
                }),
            );
    }
}
