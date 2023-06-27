import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StateProvider} from './state.provider';
import {LoadingProvider} from './loading.provider';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  loginNext$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
              private stateProvider: StateProvider,
              private loadingProvider: LoadingProvider) {
  }


  initToken() {
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirement
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      this.checkDiagnosisNext(urlParams);
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  checkDiagnosisNext(urlParams) {
    const next = urlParams.get('next');
    if (next === 'input') {
      this.loadingProvider.startLoading();
      this.stateProvider.activeStep$.next(0);
      this.loginNext$.next(next);
    }
  }

  isLogin() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

}
