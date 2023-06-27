import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  apiURL: 'https://scoring-api.ponddy.com/english/';
  devApiURL: 'https://alpha.ponddy-one.com:9479';
  authApiUrl = environment.devAuthApiUrl;
  clientId = environment.devClientId;
  apiUrl = environment.devApiUrl;
  redirectUri = environment.devRedirectUri;

  constructor() {
    // if (window.location.host.includes('voicebuddy.ponddy') || window.location.host.includes('iponddy')) {
      this.authApiUrl = environment.authApiUrl;
      this.clientId = environment.clientId;
      this.apiUrl = environment.apiUrl;
      this.redirectUri = environment.redirectUri;
    // }
  }
}
