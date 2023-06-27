import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject} from '@angular/core';
import {Subscription} from 'rxjs';

import {StateProvider} from '../../../core/providers/state.provider';
import {AudioProvider} from '../../../core/providers/audio.provider';
import {AsrResponseInterface, DiagnosisResponseInterface} from '../../../core/interfaces';
import {DomSanitizer} from "@angular/platform-browser";
import {TokenService} from "../../../core/providers/token.service";
import {PredictProvider} from "../../../core/providers/predict.provider";
import {LoadingProvider} from "../../../core/providers/loading.provider";
import {ErrorProvider} from "../../../core/providers/error.provider";
import {SentenceProvider} from '../../../core/providers/sentence.provider';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataExampleDialog } from './diagnosis.component-popup';

export interface DialogData {
  data: {
    color: string;
    value: string;
    type: string
  }[][];
}

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagnosisComponent implements OnInit, OnDestroy {
  public isAiPlayback: boolean;
  public isUserPlayback: boolean;
  public asrResponse: AsrResponseInterface;
  public diagnosisResponse: DiagnosisResponseInterface;
  public isPartDataback: string;
  private practiceLog: Subscription;

  private asrResponseSubscription: Subscription;
  private savedResponseSubscription: Subscription;
  private diagnosisResponseSubscription: Subscription;
  private isAiPlayingSubscription: Subscription;
  private isUserPlayingSubscription: Subscription;

  currentSentence: any;
  connectedWords
  savedState = false
  userSelfContent;
  practice;
  practiceId;
  nowLanguage;

  languages = [
    { id: 1, text: 'Voice Score', button: false, lang: 'en' },
    { id: 1, text: '語音評分', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Fluency', button: false, lang: 'en' },
    { id: 2, text: '流暢度', button: false, lang: 'zh-TW' },
    { id: 3, text: 'legend', button: false, lang: 'en' },
    { id: 3, text: '圖例', button: false, lang: 'zh-TW' },
    { id: 4, text: 'input text', button: false, lang: 'en' },
    { id: 4, text: '輸入的文字', button: false, lang: 'zh-TW' },
    { id: 5, text: 'Good / Excellent', button: false, lang: 'en' },
    { id: 5, text: '很好', button: false, lang: 'zh-TW' },
    { id: 6, text: 'Average / Below Average', button: false, lang: 'en' },
    { id: 6, text: '一般', button: false, lang: 'zh-TW' },
    { id: 7, text: 'Failed', button: false, lang: 'en' },
    { id: 7, text: '差', button: false, lang: 'zh-TW' },
    { id: 8, text: 'Word', button: false, lang: 'en' },
    { id: 8, text: '單詞', button: false, lang: 'zh-TW' },
    { id: 9, text: 'Expected IPA', button: false, lang: 'en' },
    { id: 9, text: '預期 IPA', button: false, lang: 'zh-TW' },
    { id: 10, text: 'Detected IPA', button: false, lang: 'en' },
    { id: 10, text: '檢測到 IPA', button: false, lang: 'zh-TW' },
    { id: 11, text: 'Your voice', button: false, lang: 'en' },
    { id: 11, text: '你的聲音', button: false, lang: 'zh-TW' },
    { id: 12, text: 'Feedback', button: false, lang: 'en' },
    { id: 12, text: '評註', button: false, lang: 'zh-TW' },
    { id: 13, text: 'Record it again', button: false, lang: 'en' },
    { id: 13, text: '再試一次', button: false, lang: 'zh-TW' },
    { id: 14, text: 'Try Another Sentence', button: false, lang: 'en' },
    { id: 14, text: '返回主頁', button: false, lang: 'zh-TW' },
  ]

  constructor(
    private readonly stateProvider: StateProvider,
    private readonly cdr: ChangeDetectorRef,
    private readonly audioProvider: AudioProvider,
    private readonly sanitizer: DomSanitizer,
    private readonly tokenService: TokenService,
    private readonly predictProvider: PredictProvider,
    private readonly loadingProvider: LoadingProvider,
    private readonly errorProvider: ErrorProvider,
    private readonly sentenceProvider: SentenceProvider,
    public dialog: MatDialog
  ) {
  }

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    this.currentSentence = JSON.parse(localStorage.getItem('currentSentence'));
    this.cdr.detectChanges();

    this.asrResponseSubscription = this.stateProvider.asrResponse$.asObservable().subscribe(asrResponse => {
      this.asrResponse = asrResponse;
      this.cdr.detectChanges();
    });

    if(localStorage.getItem('practice') === 'true'){
      this.postPractice();
    } else {
      this.postLog(this.currentSentence.id, this.currentSentence.type)
    }

    this.savedResponseSubscription = this.stateProvider.savedState$.asObservable().subscribe(savedState => {
      this.savedState = savedState;
      this.cdr.detectChanges();
    });

    this.isAiPlayingSubscription = this.audioProvider.isAiPlaying$.asObservable().subscribe(isAiPlaying => {
      this.isAiPlayback = isAiPlaying;
      this.cdr.detectChanges();
    });

    this.isUserPlayingSubscription = this.audioProvider.isUserPlaying$.asObservable().subscribe(isUserPlaying => {
      this.isUserPlayback = isUserPlaying;
      this.cdr.detectChanges();
    });


  }

  public ngOnDestroy(): void {
    if (this.diagnosisResponseSubscription) {
      this.diagnosisResponseSubscription.unsubscribe();
    }

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

  public playPartData(audioUrl, position) {
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(audioUrl);
    this.stateProvider.partDataAudio$.next(safeUrl);
    this.audioProvider.playPartDataAudio(position);
  }

  public stopPartData(): void {
    this.audioProvider.stopPartDataAudio();
  }

  public trySpecificSentence(sentence: any): void {
    if (sentence.en === 'n/a') {
      sentence = '';
    }
    localStorage.setItem('currentSentence', JSON.stringify(sentence));
    this.stateProvider.setStep(0);
    this.stateProvider.currentSentence$.next(sentence);
    this.stateProvider.generatedAudio$.next(null);
    this.stateProvider.asrResponse$.next(null);
    this.stateProvider.diagnosisResponse$.next(null);
    this.stateProvider.userAudio$.next(null);
  }

  public tryAnother(): void {
    localStorage.removeItem('activeStep');
    this.stateProvider.setStep(0);
    this.stateProvider.generatedAudio$.next(null);
    this.stateProvider.currentSentence$.next(null);
    this.stateProvider.asrResponse$.next(null);
    this.stateProvider.diagnosisResponse$.next(null);
    this.stateProvider.userAudio$.next(null);
    this.stateProvider.practice$.next(null);
  }
  public generateVoice(): void {
    localStorage.removeItem('activeStep');
    this.loadingProvider.startLoading()
    localStorage.setItem('currentSentence', JSON.stringify(this.currentSentence));
      this.stateProvider.currentSentence$.next(this.currentSentence);
      this.stateProvider.setStep(1);
      this.loadingProvider.stopLoading();
  }

  public isNumber(value: any): boolean {
    return !isNaN(value);
  }

  public reset(): void {
    localStorage.removeItem('activeStep');
    this.stateProvider.setStep(0);
    this.stateProvider.generatedAudio$.next(null);
    this.stateProvider.currentSentence$.next(null);
    this.stateProvider.asrResponse$.next(null);
    this.stateProvider.diagnosisResponse$.next(null);
    this.stateProvider.userAudio$.next(null);
    this.stateProvider.practice$.next(null);
  }

  public pinSentences() {
    this.loadingProvider.startLoading();

    let pinId;
    if(this.currentSentence.type === 'practice_sentences') {
      pinId = this.practiceId;
    } else {
      pinId = this.currentSentence.id;
    }

    this.sentenceProvider.postSentencesPin(pinId, this.currentSentence.type, this.savedState).subscribe(pinSentences => {
      const values = Object.keys(pinSentences).map(key => pinSentences[key]);
      this.savedState = values[2];
      this.stateProvider.savedState$.next(this.savedState);
      localStorage.setItem('savedState', JSON.stringify(this.savedState));
      this.loadingProvider.stopLoading();
      this.cdr.detectChanges();
    });
  }

  public postPractice() {
    this.practiceLog = this.stateProvider.practice$.asObservable().subscribe(practice => {
      this.practice = practice;
      this.cdr.detectChanges();
    });

    this.predictProvider.postPractice(this.practice).subscribe(
      res => {
        this.postLog(res.id, 'practice_sentences');
        this.practiceId = res.id
      },
      error => {
        console.error({error});
      },
    );
  }

  public postLog(id, type) {
    this.predictProvider.postLog(this.asrResponse, id, type).subscribe(
      asrResponse => {

      },
      error => {
        console.error({error});
      },
    );
  }

  openDialog(row: any, id) {
    this.dialog.open(DialogDataExampleDialog, {
      data: {
        row: row,
        id: id
      },
    });
  }
}
