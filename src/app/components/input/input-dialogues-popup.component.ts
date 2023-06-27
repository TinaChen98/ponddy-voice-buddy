import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';

import { StateProvider } from '../../../core/providers/state.provider';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingProvider } from '../../../core/providers/loading.provider';
import { MatDialog } from '@angular/material/dialog';
import { PredictProvider } from '../../../core/providers/predict.provider';
import { SentenceProvider } from '../../../core/providers/sentence.provider';
import { AudioProvider } from '../../../core/providers/audio.provider';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'input-dialog',
  templateUrl: 'input-dialogues-popup.component.html',
  styleUrls: ['input-dialogues-popup.component.scss'],
})
export class inputDialoguesDialog implements OnInit {
  @Input() public text: string;
  nowLanguage;
  dialoguesScenariosId;
  dialoguesTopic;
  private isAiPlayingSubscription: Subscription;
  isAiPlayback;
  clickContentId;
  playContentId = 0;
  clickClose = true;
  playIntroduction = true;
  document;
  isrestart;

  languages = [
    { id: 1, text: 'Start', button: false, lang: 'en' },
    { id: 1, text: '開始', button: false, lang: 'zh-TW' },
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(DOCUMENT) document: Document,
              private readonly stateProvider: StateProvider,
              private readonly loadingProvider: LoadingProvider,
              private readonly predictProvider: PredictProvider,
              private readonly sentenceProvider: SentenceProvider,
              private readonly audioProvider: AudioProvider,
              public dialog: MatDialog,
              private readonly cdr: ChangeDetectorRef) {
                this.document = document;
  }

  dialoguesScenarios

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    this.stateProvider.dialoguesScenariosId$.asObservable().subscribe(dialoguesScenariosId => {
      this.dialoguesScenariosId = dialoguesScenariosId;
      this.cdr.detectChanges();
    });

    this.stateProvider.dialoguesTopic$.asObservable().subscribe(dialoguesTopic => {
      this.dialoguesTopic = dialoguesTopic;
      this.getThemedDialoguesScenario(this.dialoguesScenariosId);
      this.cdr.detectChanges();
    });
  }

  // 取得主題對話內容
  getThemedDialoguesScenario(id) {
    this.sentenceProvider.getThemedDialoguesScenario(id).subscribe(dialoguesScenario => {
      this.dialoguesScenarios = dialoguesScenario;
      // 儲存目前主題
      this.stateProvider.dialoguesScenarios$.next(dialoguesScenario);

      // 自動播放
      this.playVoice(id, this.dialoguesScenarios.introduction_en, this.dialoguesScenarios.introduction_gender, this.dialoguesScenarios.introduction_ipa)
      this.playIntroduction = true;
      this.clickContentId = 'introduction'

      this.isAiPlayingSubscription = this.audioProvider.isAiPlaying$.asObservable().subscribe(isAiPlaying => {
        this.isAiPlayback = isAiPlaying;
        if(!this.isAiPlayback && this.dialoguesScenarios.diaglogs[this.playContentId] != undefined && this.clickClose && !this.playIntroduction) {
          this.clickContent(this.dialoguesScenarios.diaglogs[this.playContentId].id, this.dialoguesScenarios.diaglogs[this.playContentId].content, this.playContentId);
          if(this.dialoguesScenarios.diaglogs[this.playContentId-2]?.id){
            this.goToId(this.dialoguesScenarios.diaglogs[this.playContentId-2].id);
          } else {
            this.goToId('introduction');
          }
        } else {
          if(this.dialoguesScenarios.diaglogs.length === this.playContentId){
            this.isrestart = true;
          } else {
            this.isrestart = false;
          }
        }
        this.cdr.detectChanges();
      });

      this.cdr.detectChanges();
    });
  }

  clickStart() {
    this.stopAi();
    this.clickClose = false;
    this.dialog.closeAll()
    this.stateProvider.setStep(4);
  }

  public playAi(): void {
    this.audioProvider.playAiAudio();
    this.playIntroduction = false;
  }

  public stopAi(): void {
    this.audioProvider.stopAiAudio();
  }

  clickContent(id, content, i) {
    this.stopAi();
    this.playVoice(id, content)
    this.clickContentId = id;
    this.playContentId = i+1;
    this.cdr.detectChanges();
  }

  playVoice(id, content, introduction_gender?, introduction_ipa?) {
    let gender = introduction_gender;
    let ipa = introduction_ipa;
    if(!introduction_gender) {
      gender = this.dialoguesScenarios.diaglogs[this.playContentId].gender;
      ipa = this.dialoguesScenarios.diaglogs[this.playContentId].ipa
    }
    this.cdr.detectChanges();
    this.predictProvider.generateWav(content, gender, ipa).subscribe(
      generated => {
        if(this.clickClose){
          this.playAi();
        }
        this.cdr.detectChanges();
      },
      error => {
        console.error({error});
        this.loadingProvider.stopLoading();
        console.log(error);
      },
    );
  }

  close(){
    this.stopAi();
    this.clickClose = false;
  }

  start(){
    this.clickClose = true;

    if(this.playContentId === 0){
      this.playVoice(0, this.dialoguesScenarios.introduction_en)
    } else {
      this.clickContent(this.dialoguesScenarios.diaglogs[this.playContentId-1].id, this.dialoguesScenarios.diaglogs[this.playContentId-1].content, this.playContentId-1);
    }

    if(this.dialoguesScenarios.diaglogs[this.playContentId-3]?.id){
      this.goToId(this.dialoguesScenarios.diaglogs[this.playContentId-2].id);
    } else {
      this.goToId('introduction');
    }
  }

  clickRestart(){
    this.isrestart = false;
    this.playContentId = 0;
    this.clickContentId = 'introduction'
    this.start();
  }

  goToId(id: any) {
    this.document.getElementById(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
}
