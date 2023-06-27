import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

import {StateProvider} from '../core/providers/state.provider';
import {AudioProvider} from '../core/providers/audio.provider';
import {TokenService} from "../core/providers/token.service";
import {EnvironmentService} from "../core/providers/environment.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public activeStep = 0;
  public homeState = true;
  public aiAudioSource: string;
  public userAudioSource: SafeUrl;
  public partDataAudioSource: SafeUrl;
  isShowFooter = false

  private activeStepSubscription: Subscription;
  private aiAudioSourceSubscription: Subscription;
  private userAudioSourceSubscription: Subscription;
  private partDataAudioSourceSubscription: Subscription;
  apiUrl

  constructor(
    private readonly stateProvider: StateProvider,
    private readonly audioProvider: AudioProvider,
    private readonly cdr: ChangeDetectorRef,
    private readonly tokenService: TokenService,
    private readonly environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.apiUrl;
  }

  public ngOnInit(): void {
    if(localStorage.getItem('lang')) {
      if(localStorage.getItem('lang').indexOf('TW') != -1 || localStorage.getItem('lang').indexOf('zh-Hant') != -1 || localStorage.getItem('lang').indexOf('tw') != -1) {
        this.stateProvider.setLanguage('zh-TW');
      } else {
        this.stateProvider.setLanguage('en');
      }
    } else {
      if(navigator.language.indexOf('TW') != -1 || navigator.language.indexOf('zh-Hant') != -1 || navigator.language.indexOf('tw') != -1) {
        this.stateProvider.setLanguage('zh-TW');
      } else {
        this.stateProvider.setLanguage('en');
      }
    }

    if(this.tokenService.isLogin()) {
      this.homeState = false;
    }
    this.initFooter()
    this.tokenService.initToken();
    this.activeStepSubscription = this.stateProvider.activeStep$.asObservable().subscribe(activeStep => {
      if(localStorage.getItem('activeStep')) {
        this.activeStep = JSON.parse(localStorage.getItem('activeStep'));
      } else {
        this.activeStep = activeStep;
      }
      this.cdr.detectChanges();
    });

    this.aiAudioSourceSubscription = this.stateProvider.generatedAudio$.asObservable().subscribe(response => {
      if (response && response.audio_path) {
        this.aiAudioSource = `${response.audio_path}`;
        this.cdr.detectChanges();
        this.audioProvider.reloadAiSource();
      }
    });

    this.userAudioSourceSubscription = this.stateProvider.userAudio$.asObservable().subscribe(userAudio => {
      this.userAudioSource = userAudio;
      this.cdr.detectChanges();
      this.audioProvider.reloadUserSource();
    });
    this.partDataAudioSourceSubscription = this.stateProvider.partDataAudio$.asObservable().subscribe(partDataAudioUrl => {
      this.partDataAudioSource = partDataAudioUrl;
      this.cdr.detectChanges();

      this.audioProvider.reloadPartDataSource();
    });
  }

  public ngOnDestroy(): void {
    if (this.activeStepSubscription) {
      this.activeStepSubscription.unsubscribe();
    }

    if (this.aiAudioSourceSubscription) {
      this.aiAudioSourceSubscription.unsubscribe();
    }

    if (this.userAudioSourceSubscription) {
      this.userAudioSourceSubscription.unsubscribe();
    }
  }

  private initFooter() {
    if (window.location.host.includes('iponddy')) {
      this.isShowFooter = true;
    }
  }

  changeHomeState(homeState: any) {
    this.homeState = homeState
  }

}
