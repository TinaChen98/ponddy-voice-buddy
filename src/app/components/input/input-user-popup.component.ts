import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';

import { StateProvider } from '../../../core/providers/state.provider';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingProvider } from '../../../core/providers/loading.provider';
import { MatDialog } from '@angular/material/dialog';
import { PredictProvider } from '../../../core/providers/predict.provider';

@Component({
  selector: 'input-dialog',
  templateUrl: 'input-user-popup.component.html',
  styleUrls: ['input-user-popup.component.scss'],
})
export class inputUserDialog implements OnInit {
  @Input() public text: string;
  nowLanguage;

  languages = [
    { id: 1, text: 'Please enter an English sentence', button: false, lang: 'en' },
    { id: 1, text: '請輸入英文句子', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Please enter an English sentence', button: false, lang: 'en' },
    { id: 2, text: '請輸入英文句子', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Start', button: false, lang: 'en' },
    { id: 3, text: '開始', button: false, lang: 'zh-TW' },
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private readonly stateProvider: StateProvider,
              private readonly loadingProvider: LoadingProvider,
              private readonly predictProvider: PredictProvider,
              public dialog: MatDialog,
              private readonly cdr: ChangeDetectorRef) {
  }

  isTextVaild = true;
  defaultPlaceholder;
  currentSentence;

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    if(this.languages[2].lang === this.nowLanguage) {
      this.defaultPlaceholder = this.languages[2].text;
    } else if(this.languages[3].lang === this.nowLanguage){
      this.defaultPlaceholder = this.languages[3].text;
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
  }

  public generateVoice(): void {
    this.dialog.closeAll();
    this.loadingProvider.startLoading();
      this.text = this.text.replace("’", "'");
      this.predictProvider.addWav(this.text)
        .subscribe(
          add => {
            this.currentSentence = add
            localStorage.setItem('currentSentence', JSON.stringify(this.currentSentence));
            this.stateProvider.currentSentence$.next(this.currentSentence);
            this.stateProvider.setStep(1);
            this.loadingProvider.stopLoading();
          },
          error => {
            console.error({error});
            this.loadingProvider.stopLoading();
          },
        );
  }

  public delText() {
    this.text = '';
  }
}
