import {Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {StateProvider} from '../../../core/providers/state.provider';
import {TokenService} from "../../../core/providers/token.service";
import {LoadingProvider} from '../../../core/providers/loading.provider';
import { environment } from '../../../environments/environment';
import { EnvironmentService } from "../../../core/providers/environment.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  url;

  apiUrl
  authApiUrl
  clientId
  redirectUri
  nowLanguage;

  languages = [
    { id: 1, text: 'Master English Speaking with AI Buddy!', button: false, lang: 'en' },
    { id: 1, text: '陪伴你英語口說進步的好夥伴！', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Ponddy X AI Speech Assessment', button: false, lang: 'en' },
    { id: 2, text: 'Ponddy X AI 語音評分', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Start', button: false, lang: 'en' },
    { id: 3, text: '開始', button: false, lang: 'zh-TW' }
  ]

  @Output() homeState = new EventEmitter<boolean>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly tokenService: TokenService,
    private readonly stateProvider: StateProvider,
    private readonly loadingProvider: LoadingProvider,
    private environmentService: EnvironmentService,
  ) {
    this.apiUrl = this.environmentService.apiUrl;
    this.authApiUrl = this.environmentService.authApiUrl;
    this.clientId = this.environmentService.clientId;
    this.redirectUri = this.environmentService.redirectUri;
  }

  public ngOnInit(): void {
    this.loadingProvider.stopLoading();
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });
  }

  loginState(type) {
    if (!this.tokenService.isLogin()) {
      if(type === 'customized') {
        localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3Rlci0xIiwiZmlyc3RfbmFtZSI6IiIsImxhc3RfbmFtZSI6IiIsImltYWdlIjpudWxsLCJlbWFpbCI6InZ6eDM4Nzc0QHp3b2hvLmNvbSIsInRpbWUiOiIxNjgyODcxMTYxLjg1MDI1NzkiLCJhcGkiOiJjNmFmMTQ4ZS00MzhlLTQyNTctYmFiZi1jYjZjYmJiNmM1NDAiLCJ1dWlkIjoiMWQwM2NlYjAtZDc1Zi00OGZmLThiMTUtYzRkZGE1NDBlOGFjIiwibGFzdF9zb3VyY2UiOiJhdXRoLnBvbmRkeS5jb20iLCJyZWFsX2VtYWlsIjpudWxsfQ.w8sI5ESz8x0OzNDHPGWjHcgRl0OxVcFqQhI_WO6s7Ps');
      } else if(type === 'dialogues') {
        localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3Rlci0yIiwiZmlyc3RfbmFtZSI6IiIsImxhc3RfbmFtZSI6IiIsImltYWdlIjpudWxsLCJlbWFpbCI6InFwYTMxNzA5QG9xaXdxLmNvbSIsInRpbWUiOiIxNjgyODcxMjIyLjQzMDM5NiIsImFwaSI6ImM2YWYxNDhlLTQzOGUtNDI1Ny1iYWJmLWNiNmNiYmI2YzU0MCIsInV1aWQiOiIyNTEyODNmNS0zM2FkLTQxNDAtOWIwNS02YTQ4YWEwN2ExMjQiLCJsYXN0X3NvdXJjZSI6ImF1dGgucG9uZGR5LmNvbSIsInJlYWxfZW1haWwiOm51bGx9.2_6700PzN1tmka7TIaSMC4NwVhS4jzL7dw45pAeq1nI');
      }
      location.href = location.href;
    } else {
      this.homeState.emit(false);
    }
  }
}
