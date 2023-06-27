import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import {StateProvider} from '../../../core/providers/state.provider';
import {AudioProvider} from '../../../core/providers/audio.provider';
import {DomSanitizer} from "@angular/platform-browser";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: {
    color: string;
    value: string;
    type: string
  }[][];
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'diagnosis.component-popup.html',
  styleUrls: ['diagnosis.component-popup.scss'],
})
export class DialogDataExampleDialog implements OnInit {
  nowLanguage;

  languages = [
    { id: 1, text: 'Detected IPA', button: false, lang: 'en' },
    { id: 1, text: '你的音標', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Your voice', button: false, lang: 'en' },
    { id: 2, text: '你的聲音', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Feedback', button: false, lang: 'en' },
    { id: 3, text: '評註', button: false, lang: 'zh-TW' }
  ]

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private readonly cdr: ChangeDetectorRef,
              private readonly sanitizer: DomSanitizer,
              private readonly stateProvider: StateProvider,
              private readonly audioProvider: AudioProvider,) {
    console.log(data.row);
  }

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });
  }

  public isPartDataback: string;

  public playPartData(audioUrl, position) {
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(audioUrl);
    this.stateProvider.partDataAudio$.next(safeUrl);
    this.audioProvider.playPartDataAudio(position);
  }

  public stopPartData(): void {
    this.audioProvider.stopPartDataAudio();
  }
}
