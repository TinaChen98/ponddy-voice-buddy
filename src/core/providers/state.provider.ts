import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import {
  GenerateWavResponseInterface,
  AsrResponseInterface,
  DiagnosisResponseInterface,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateProvider {
  public savedState$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public activeStep$: BehaviorSubject<number> = new BehaviorSubject(0);
  public generatedAudio$: BehaviorSubject<GenerateWavResponseInterface> = new BehaviorSubject(null);
  public userAudio$: BehaviorSubject<SafeUrl> = new BehaviorSubject(null);
  public userSelf$: BehaviorSubject<any> = new BehaviorSubject(null);
  public practice$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentSentence$: BehaviorSubject<any> = new BehaviorSubject(null);
  public partDataAudio$: BehaviorSubject<SafeUrl> = new BehaviorSubject(null);
  public asrResponse$: BehaviorSubject<AsrResponseInterface> = new BehaviorSubject(null);
  public diagnosisResponse$: BehaviorSubject<DiagnosisResponseInterface> = new BehaviorSubject(null);
  public setLanguage$: BehaviorSubject<any> = new BehaviorSubject(0);
  // 主題對話 - 目前主題
  public dialoguesTopic$: BehaviorSubject<any> = new BehaviorSubject(null);
  // 主題對話 - 選擇的主題對話 ID
  public dialoguesScenariosId$: BehaviorSubject<number> = new BehaviorSubject(0);
  // 主題對話 - 儲存目前主題對話內容
  public dialoguesScenarios$: BehaviorSubject<any> = new BehaviorSubject(null);

  public setLanguage(setLanguage) {
    this.setLanguage$.next(setLanguage);
    localStorage.setItem('lang', setLanguage)
  }

  public setStep(activeStep: number): void {
    this.activeStep$.next(activeStep);
  }

  public savedState(savedState) {
    this.savedState$.next(savedState);
  }
}
