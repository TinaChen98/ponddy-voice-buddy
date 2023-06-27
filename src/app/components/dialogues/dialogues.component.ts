import {Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter, ChangeDetectorRef, Inject} from '@angular/core';
import {StateProvider} from '../../../core/providers/state.provider';
import {PredictProvider} from '../../../core/providers/predict.provider';
import {AudioProvider} from '../../../core/providers/audio.provider';
import {ErrorProvider} from '../../../core/providers/error.provider';
import {TokenService} from "../../../core/providers/token.service";
import {LoadingProvider} from '../../../core/providers/loading.provider';
import { environment } from '../../../environments/environment';
import { EnvironmentService } from "../../../core/providers/environment.service";
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialoguesPopupDialog } from './dialogues-popup.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dialogues',
  templateUrl: './dialogues.component.html',
  styleUrls: ['./dialogues.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialoguesComponent implements OnInit {
  url;

  pageStatus = 0;
  nowLanguage;
  dialoguesScenarios;
  dialoguesTopic;
  nowRate = 1;
  playContentId;
  clickContentId;
  clickI;
  private isAiPlayingSubscription: Subscription;
  isAiPlayback;
  private isRecordingSubscription: Subscription;
  isRecording;
  playUserRecordStart = false;
  diagnosis = [];
  stepOk = false;
  document;
  userRecordContent = {};

  languages = [
    { id: 1, text: '重新開始', button: false, lang: 'en' },
    { id: 1, text: '重新開始', button: false, lang: 'zh-TW' },
    { id: 2, text: '分析結果', button: false, lang: 'en' },
    { id: 2, text: '分析結果', button: false, lang: 'zh-TW' },
  ]

  @Output() homeState = new EventEmitter<boolean>();

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly cdr: ChangeDetectorRef,
    private readonly tokenService: TokenService,
    private readonly stateProvider: StateProvider,
    private readonly loadingProvider: LoadingProvider,
    private readonly predictProvider: PredictProvider,
    private readonly audioProvider: AudioProvider,
    private readonly errorProvider: ErrorProvider,
    public dialog: MatDialog,
  ) {
    this.document = document;
  }

  public ngOnInit(): void {
    this.loadingProvider.stopLoading();
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    this.stateProvider.dialoguesScenarios$.asObservable().subscribe(dialoguesScenarios => {
      this.dialoguesScenarios = dialoguesScenarios;
      this.restart();
      this.cdr.detectChanges();
    });

    this.stateProvider.dialoguesTopic$.asObservable().subscribe(dialoguesTopic => {
      this.dialoguesTopic = dialoguesTopic;
      this.cdr.detectChanges();
    });

    this.isAiPlayingSubscription = this.audioProvider.isAiPlaying$.asObservable().subscribe(isAiPlaying => {
      this.isAiPlayback = isAiPlaying;
      this.cdr.detectChanges();
    });

    this.isRecordingSubscription = this.audioProvider.isRecording$.asObservable().subscribe(isRecording => {
      this.isRecording = isRecording;
      this.cdr.detectChanges();
    });


    this.getRecordAsr();
  }

  getRecordAsr(){
    var human = 0;
    var user = 0;
    for(var i=0;i<this.dialoguesScenarios.diaglogs.length;i++){
      if(this.dialoguesScenarios.diaglogs[i].role === 'Human') {
        human++;
      }
    }

    for(var i=0;i<Object.keys(this.userRecordContent).length;i++) {
      if(this.userRecordContent[Object.keys(this.userRecordContent)[i]]?.status != 'error') {
        user++;
      }
    }

    if(human === user) {
      this.stepOk = true;
    } else {
      this.stepOk = false;
    }
    this.cdr.detectChanges();
  }

  // 前端調整 TTS 播放速度
  playRate() {
    const obj = document.querySelector('audio');
    const rate = document.querySelector('#rate');
    obj.playbackRate = Number((rate as HTMLInputElement).value)
    this.nowRate = obj.playbackRate;
    this.cdr.detectChanges();
  }

  public reset(): void {
    localStorage.removeItem('activeStep');
    for(var i=0;i<=this.dialoguesScenarios.diaglogs.length-1;i++){
      localStorage.removeItem(this.dialoguesScenarios.diaglogs[i].id);
    }

    this.stateProvider.dialoguesScenarios$.next(null);
    this.stateProvider.dialoguesScenariosId$.next(null);
    location.href = location.href;
  }

  clickContent(id, content, playStart, i) {
    this.stopAi();
    this.stopUser();

    this.clickI = i;
    this.clickContentId = id;

    if(localStorage.getItem(id)){
      this.playUserRecordStart = true;
    } else {
      this.playUserRecordStart = false;
    }

    if(playStart) {
      // AI
      this.playVoice(id, content, true)
    }
    this.cdr.detectChanges();

    if(this.dialoguesScenarios.diaglogs[i-1]){
      setTimeout(this.goToId, 0, this.dialoguesScenarios.diaglogs[i-1].id)
    } else {
      setTimeout(this.goToId, 0, 'photo')
    }
  }

  playVoice(id, content, rate) {
    this.playContentId = id;
    this.cdr.detectChanges();
    this.predictProvider.generateWav(content, this.dialoguesScenarios.diaglogs[this.clickI].gender, this.dialoguesScenarios.diaglogs[this.clickI].ipa).subscribe(
      generated => {
        this.playAi(rate);
        this.cdr.detectChanges();
      },
      error => {
        console.error({error});
        this.loadingProvider.stopLoading();
        console.log(error);
      },
    );
  }

  public playAi(rate): void {
    if(rate) {
      this.playRate();
    }
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

  public playUserRecord(play){
    const music = new Audio(play);
    music.play();
  }

  public record(): void {
    let errorStatus = this.audioProvider.toggleRecord();
    localStorage.removeItem(this.clickContentId);
    this.cdr.detectChanges();
    errorStatus.then((value) => {
      if(value === 'error') {
        // this.openDialog('openVoice')
      } else {
        // this.audioProvider.toggleRecord();
      }
    });
  }

  public stopRecording(content, ipa, status?, i?, id?): void {
    if(status) {
      this.audioProvider.toggleRecord().then((res)=>{
        this.userRecordContent[id] = {status: 'analyzing', content: content};
        this.cdr.detectChanges();
        this.getAsr(content, ipa, id);
        }).catch((error)=>{
          console.log(`Handling error as we received ${error}`);
        });
    } else {
      this.audioProvider.toggleRecord();
    }

    // if(this.dialoguesScenarios.diaglogs[i+1]!= undefined){
    //   if(this.dialoguesScenarios.diaglogs[i+1].role === 'AI') {
    //     this.clickContent(this.dialoguesScenarios.diaglogs[i+1].id, this.dialoguesScenarios.diaglogs[i+1].content, true, i+1)
    //   } else {
    //     this.clickContent(this.dialoguesScenarios.diaglogs[i+1].id, this.dialoguesScenarios.diaglogs[i+1].content, false, i+1)
    //   }
    // }
  }

  public skipped(id, content, i){
    this.userRecordContent[this.clickContentId] = {status: 'skipped', content: content};
    this.getRecordAsr();

    if(this.dialoguesScenarios.diaglogs[i+1]!= undefined){
      if(this.dialoguesScenarios.diaglogs[i+1].role === 'AI') {
        this.clickContent(this.dialoguesScenarios.diaglogs[i+1].id, this.dialoguesScenarios.diaglogs[i+1].content, true, i+1)
      } else {
        this.clickContent(this.dialoguesScenarios.diaglogs[i+1].id, this.dialoguesScenarios.diaglogs[i+1].content, false, i+1)
      }
    }
    this.cdr.detectChanges();
  }

  public score(content, ipa, i): void {
    if(localStorage.getItem(this.clickContentId)){
      let asrResponse = JSON.parse(localStorage.getItem(this.clickContentId))
      this.playUserRecord(asrResponse.s3.user_voice)
    } else {
      this.loadingProvider.startLoading();
      this.getAsr(content, ipa)
    }
    localStorage.removeItem('activeStep')
  }


  public getAsr(content, ipa, id?) {
    if(ipa === undefined || ipa === "None") ipa = '';

    this.predictProvider.getAsr(content, this.audioProvider.base64$.getValue(), ipa).subscribe(
      asrResponse => {
        localStorage.setItem(id, JSON.stringify(asrResponse))
        this.userRecordContent[id] = asrResponse;
        this.playUserRecordStart = true;
        this.stateProvider.asrResponse$.next(asrResponse);
        localStorage.setItem('asrResponseData', JSON.stringify(asrResponse));
        this.loadingProvider.stopLoading();
        this.cdr.detectChanges();
        this.getRecordAsr();
      },
      error => {
        console.error({error});
        if (error) {
          this.userRecordContent[id] = {status: 'error', content: content, errorMessage: error.error.detail};
        } else {
          this.userRecordContent[id] = {status: 'error', content: content, errorMessage: 'Failed to get simple analysis, please try it again later!'};
        }
        this.cdr.detectChanges();
      },
    );
  }


  openDialog() {
    this.stopAi();
    this.stopUser();
    this.dialog.open(DialoguesPopupDialog,{
      data: {
        userRecordContent: this.userRecordContent
      }
    });
  }

  restart() {
    this.loadingProvider.startLoading();
    this.stopAi();
    this.stopUser();
    for(var i=0;i<=this.dialoguesScenarios.diaglogs.length-1;i++){
      localStorage.removeItem(this.dialoguesScenarios.diaglogs[i].id);
    }

    this.userRecordContent = {};
    this.stepOk = false;

    this.cdr.detectChanges();
    this.loadingProvider.stopLoading();
    this.clickContent(this.dialoguesScenarios.diaglogs[0].id, this.dialoguesScenarios.diaglogs[0].content, true, 0)
  }

  goToId(id: any) {
    this.document.getElementById(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
}
