import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {StateProvider} from './state.provider';
import {LoadingProvider} from './loading.provider';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { UserResponseInterface } from '../interfaces/user.response.interface';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class UserProvider {
  apiUrl
  authApiUrl
  clientId
  redirectUri

  constructor(
              private readonly httpClient: HttpClient,
              private readonly environmentService: EnvironmentService) {
                this.apiUrl = this.environmentService.apiUrl;
                this.authApiUrl = this.environmentService.authApiUrl;
                this.clientId = this.environmentService.clientId;
                this.redirectUri = this.environmentService.redirectUri;

  }


  public userSelf(): Observable<UserResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<UserResponseInterface>(`${this.apiUrl}/users/profiles/self`, options);
  }
}
