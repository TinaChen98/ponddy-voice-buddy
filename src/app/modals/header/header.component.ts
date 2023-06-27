import { UserProvider } from './../../../core/providers/user.provider';
import { TokenService } from "../../../core/providers/token.service";
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import { EnvironmentService } from "../../../core/providers/environment.service";
import {StateProvider} from '../../../core/providers/state.provider';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userImage = 'assets/images/userImage-default.svg'
  userName;
  user;
  userState

  apiUrl
  authApiUrl
  clientId
  redirectUri
  nowLanguage;

  languages = [
    { id: 1, text: 'Change Profile', button: false, lang: 'en' },
    { id: 1, text: '帳號設定', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Privacy policy', button: false, lang: 'en' },
    { id: 2, text: '隱私政策', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Terms of service', button: false, lang: 'en' },
    { id: 3, text: '服務條款', button: false, lang: 'zh-TW' },
    { id: 4, text: 'Logout', button: false, lang: 'en' },
    { id: 4, text: '登出', button: false, lang: 'zh-TW' }
  ]

  constructor(private environmentService: EnvironmentService,
              private readonly stateProvider: StateProvider,
              private readonly userProvider: UserProvider,
              private readonly cdr: ChangeDetectorRef,
              private readonly tokenService: TokenService) {
                this.apiUrl = this.environmentService.apiUrl;
                this.authApiUrl = this.environmentService.authApiUrl;
                this.clientId = this.environmentService.clientId;
                this.redirectUri = this.environmentService.redirectUri;

  }


  ngOnInit(): void {
    this.userState = this.tokenService.isLogin()
    if(this.userState){this.userSelf()}
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });
  }

  public goHome() {
    this.stateProvider.setStep(0);
  }

  public setLanguage(lang) {
    this.stateProvider.setLanguage(lang);
    this.nowLanguage = lang;
    this.cdr.detectChanges();
  }

  public userSelf(): void {
    this.userProvider.userSelf()
      .subscribe(
        userSelf => {
          this.stateProvider.userSelf$.next(userSelf);
          this.user = userSelf
          if(userSelf.user.username.length>8) {
            this.userName = userSelf.user.username.substr(0,8) + '...'
          } else {
            this.userName = userSelf.user.username
          }
          if(userSelf.image!=null) this.userImage = userSelf.image;
          this.cdr.detectChanges();
        },
        error => {
          console.error({error});
        },
      );
  }

  public logout(): void {
    localStorage.clear();
    location.href = location.href;
  }

  public changeProfile(): void {
    var language = "en";
    if (this.user.user && this.user.user.language) {
      language = this.user.language;
      if (language === "zh") {
        language = "zh-hans";
      } else if (language === "zh-TW") {
        language = "zh-hant";
      } else if (language === 'th') {
        language = 'en'
      }
    }

    let url = `${this.authApiUrl}/auth/profile/?client_id=${this.clientId}&token=${localStorage.getItem('token')}&redirect_uri=${this.redirectUri}`;
    url = decodeURIComponent(url)
    window.open(url, '_self')
  }

  public openPolicy(type) {
    if(type == 'privacy-policy') {
      window.open('https://ponddy-apps.s3.us-west-2.amazonaws.com/voice-buddy/legal_documents/privacy_policy/zh-tw/privacy_policy.htm', '_black')
    } else if(type == 'terms-of-use') {
      window.open('https://ponddy-apps.s3.us-west-2.amazonaws.com/voice-buddy/legal_documents/terms_of_use/zh-tw/terms_of_use.htm', '_black')
    }
  }
}
