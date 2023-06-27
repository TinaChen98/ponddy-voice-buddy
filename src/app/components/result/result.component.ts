import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { StateProvider } from '../../../core/providers/state.provider';
import { AsrResponseInterface } from '../../../core/interfaces';
import { AudioProvider } from '../../../core/providers/audio.provider';
import { LoadingProvider } from '../../../core/providers/loading.provider';
import { PredictProvider } from '../../../core/providers/predict.provider';
import { ErrorProvider } from '../../../core/providers/error.provider';
import {TokenService} from "../../../core/providers/token.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginModalComponent} from "../../modals/login-modal/login-modal.component";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent implements OnInit, OnDestroy {
  public isAiPlayback: boolean;
  public isUserPlayback: boolean;
  public asrResponse: AsrResponseInterface;

  private asrResponseSubscription: Subscription;
  private isAiPlayingSubscription: Subscription;
  private isUserPlayingSubscription: Subscription;
  private connectedWordsSubscription: Subscription;

  currentSentence: any;
  connectedWords

  constructor(
    private readonly stateProvider: StateProvider,
    private readonly audioProvider: AudioProvider,
    private readonly loadingProvider: LoadingProvider,
    private readonly predictProvider: PredictProvider,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorProvider: ErrorProvider,
    private readonly tokenService: TokenService,
    private readonly dialog: MatDialog

  ) {}

  public ngOnInit(): void {
    // this.asrResponseSubscription = this.stateProvider.asrResponse$.asObservable().subscribe(asrResponse => {
    //   this.asrResponse = asrResponse;
    //   localStorage.setItem('asrResponseData', JSON.stringify(asrResponse.data));
    //   this.cdr.detectChanges();
    //   this.connectedWordsDraw();
    // });

    this.isAiPlayingSubscription = this.audioProvider.isAiPlaying$.asObservable().subscribe(isAiPlaying => {
      this.isAiPlayback = isAiPlaying;
      this.cdr.detectChanges();
    });

    this.isUserPlayingSubscription = this.audioProvider.isUserPlaying$.asObservable().subscribe(isUserPlaying => {
      this.isUserPlayback = isUserPlaying;
      this.cdr.detectChanges();
    });
    this.currentSentence = JSON.parse(localStorage.getItem('currentSentence'));
    this.cdr.detectChanges();

  }
// TODO connected words - Step 3
  public connectedWordsDraw(): void {
    this.connectedWordsSubscription = this.stateProvider.generatedAudio$.asObservable().subscribe(connectedWords => {
      this.connectedWords = connectedWords;
      for (let index = 0; index < this.connectedWords?.data?.connected_results?.length; index++) {
        var sum = 0;
        var num = 1
        for (let x = this.connectedWords.data.connected_results[index].start_end_word_index[0]; x < this.connectedWords.data.connected_results[index].start_end_word_index[1]-num; x++) {
          if(document.getElementById('text3_' + x).innerHTML === ',' || document.getElementById('text3_' + x).innerHTML === '.'){
            x++;
            num--;
          }
          var sentenceTextCount = document.getElementById('text3_' + x).offsetWidth;
          var sentenceTextCountNext = document.getElementById('text3_' + (x+1)).offsetWidth;
          var lineMargin = sentenceTextCount/2;
          var lineWidth = ((sentenceTextCount)/2) + 6 + ((sentenceTextCountNext)/2);
          document.getElementById('line3_' + x).style.marginLeft = lineMargin + 'px';
          document.getElementById('line3_' + x).style.width = lineWidth + 'px';
          document.getElementById('line3y_' + x).style.marginLeft = lineMargin + 'px';
          document.getElementById('line3y_' + x).style.width = lineWidth + 'px';

          sum++;
        }
      }
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    if (this.asrResponseSubscription) {
      this.asrResponseSubscription.unsubscribe();
    }

    if (this.isAiPlayingSubscription) {
      this.isAiPlayingSubscription.unsubscribe();
    }

    if (this.isUserPlayingSubscription) {
      this.isUserPlayingSubscription.unsubscribe();
    }
  }

  public playAi(): void {
    this.audioProvider.playAiAudio();
  }

  public stopAi(): void {
    this.audioProvider.stopAiAudio();
  }

  public playUser(): void {
    this.audioProvider.playUserAudio();
  }

  public stopUser(): void {
    this.audioProvider.stopUserAudio();
  }

  public tryAnother(): void {
    this.stateProvider.setStep(0);
    this.stateProvider.generatedAudio$.next(null);
    this.stateProvider.currentSentence$.next(null);
    this.stateProvider.asrResponse$.next(null);
    this.stateProvider.diagnosisResponse$.next(null);
    this.stateProvider.userAudio$.next(null);
  }

  // public getScoringIndex(): void {
  //   if (!this.tokenService.isLogin()) {
  //     this.dialog.open(LoginModalComponent);

  //     return;
  //   }
  //   this.loadingProvider.startLoading();
  //   this.predictProvider.getDiagnosis({
  //     ...this.asrResponse.data,
  //     base64: this.audioProvider.base64$.getValue(),
  //   }).subscribe(
  //     () => {
  //       this.stateProvider.setStep(3);
  //       this.loadingProvider.stopLoading();
  //     },
  //     error => {
  //       console.error({ error });
  //       this.loadingProvider.stopLoading();
  //       if (error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].message) {
  //         this.errorProvider.errorMessage$.next(error.error.errors[0].message);
  //         this.errorProvider.errorCode$.next(error.error.errors[0].code);
  //       } else {
  //         this.errorProvider.errorMessage$.next('Failed to get Ponddy Diagnosis, please try it again later!');
  //       }
  //     },
  //   );
  // }

  public tryAgain(): void {
    this.stateProvider.setStep(1);
  }
}
