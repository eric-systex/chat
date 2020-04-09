import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpclientService } from '../_helpers/httpclient.service';
import { SharedService } from '../_helpers/shared.service';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  
  constructor(private http: HttpclientService, private shared: SharedService) { }

  login(username: string, password: string) {
    
    return this.http.post('login', { username, password })
        .pipe(map(user => {
            console.log(user);
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('access_token', user.token);

                this.shared.logined(this.getUser());
            }
            return user;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  }

  getUser(): User {
    let user = localStorage.getItem('user');
    return JSON.parse(user);
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token');
  }
}
