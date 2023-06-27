import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';

import {StateProvider} from '../../../core/providers/state.provider';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {LoadingProvider} from '../../../core/providers/loading.provider';
import { MatDialog } from '@angular/material/dialog';
import {Subscription} from 'rxjs';

export interface DialogData {
  data: {
    color: string;
    value: string;
    type: string
  }[][];
}

@Component({
  selector: 'input-dialog',
  templateUrl: 'input.component-popup.html',
  styleUrls: ['input.component-popup.scss'],
})
export class inputDialog implements OnInit {
  @Input() public text: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private readonly stateProvider: StateProvider,
              private readonly loadingProvider: LoadingProvider,
              public dialog: MatDialog,
              private readonly cdr: ChangeDetectorRef) {
  }

  public isPartDataback: string;
  private currentUserSelf: Subscription;
  userSelfContent;
  isTextVaild = true;
  defaultPlaceholder;
  nowLanguage;

  languages = [
    { id: 1, text: 'Please enter an English sentence', button: false, lang: 'en' },
    { id: 1, text: '請輸入英文句子', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Start', button: false, lang: 'en' },
    { id: 2, text: '開始', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Enter English AB dialogue', button: false, lang: 'en' },
    { id: 3, text: '輸入英文 AB 對話', button: false, lang: 'zh-TW' },
  ]

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    if(this.data.type === 'practice_sentences'){
      this.text = this.data.content;
    }
    if(this.data.level_cefr_name === null){
      if(this.languages[4].lang === this.nowLanguage) {
        this.defaultPlaceholder = this.languages[4].text;
      } else if(this.languages[5].lang === this.nowLanguage){
        this.defaultPlaceholder = this.languages[5].text;
      }
    } else {
      if(this.languages[0].lang === this.nowLanguage) {
        this.defaultPlaceholder = this.languages[0].text;
      } else if(this.languages[1].lang === this.nowLanguage){
        this.defaultPlaceholder = this.languages[1].text;
      }
    }
    this.cdr.detectChanges();
  }

  generateSentenceByText(text) {
    this.text = text;
    if (this.text) {
      const words = this.text.split('').length;
      if (words >= 300) {
        this.isTextVaild = false;
      } else {
        this.isTextVaild = true;
      }
    }
    this.data.currentSentence = {
      ch: '', en: text
    };
  }


  public generateVoice(): void {
    this.dialog.closeAll()
    this.practiceLog()

    this.loadingProvider.startLoading();
    this.stateProvider.savedState(this.data.saved);
    this.text = this.text.replace("’", "'");
    let currentSentence = {
      id: this.data.object_id,
      type: 'customized_sentences',
      content: this.text,
      practice_id: this.data.practice_id
    }
    localStorage.setItem('currentSentence', JSON.stringify(currentSentence));
    this.stateProvider.currentSentence$.next(currentSentence);
    this.stateProvider.setStep(1);
    this.loadingProvider.stopLoading();
  }

  public delText() {
    this.text = '';
  }

  public practiceLog() {
     this.currentUserSelf = this.stateProvider.userSelf$.asObservable().subscribe(userContent => {
      this.userSelfContent = userContent;
    });

    let ipa;
    this.data.ipa === undefined? ipa = '': ipa = this.data.ipa;

    let practice = {
      content: this.text ,
      topic: this.data.topic,
      label: this.data.label,
      level_cefr: this.data.level_cefr,
      user: this.userSelfContent.id,
      object_id: this.data.object_id,
      ipa: ipa
    }

    localStorage.setItem('practice', 'true')
    this.stateProvider.practice$.next(practice);
  }
}
