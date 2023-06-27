import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateProvider } from '../../../core/providers/state.provider';

@Component({
  selector: 'input-dialog',
  templateUrl: 'speak-popup.component.html',
  styleUrls: ['speak-popup.component.scss'],
})
export class SpeakDialog implements OnInit {
  type;
  nowLanguage;

  languages = [
    { id: 1, text: 'Tips for achieving high scores on voice scoring.', button: false, lang: 'en' },
    { id: 1, text: '語音評分獲得高分的秘訣', button: false, lang: 'zh-TW' },
    { id: 2, text: 'Keep the recording environment as quiet as possible and avoid noise.', button: false, lang: 'en' },
    { id: 2, text: '錄音環境請盡量安靜避免噪音', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Keep a normal speaking speed.', button: false, lang: 'en' },
    { id: 3, text: '語速請保持正常', button: false, lang: 'zh-TW' },
    { id: 4, text: 'Keep a moderate voice volume.', button: false, lang: 'en' },
    { id: 4, text: '音量請維持適中', button: false, lang: 'zh-TW' },
    { id: 5, text: 'Slow and clear pronunciation is most likely to achieve high scores.', button: false, lang: 'en' },
    { id: 5, text: '緩慢且清楚唸出最容易獲得高分', button: false, lang: 'zh-TW' },
    { id: 6, text: 'Keep a moderate distance with the microphone, because microphone popping will affect the score.', button: false, lang: 'en' },
    { id: 6, text: '爆音會影響評分, 錄音距離請適中', button: false, lang: 'zh-TW' },
    { id: 7, text: 'An open environment with echoes will also affect the score.', button: false, lang: 'en' },
    { id: 7, text: '空曠的環境有回音也會影響評分', button: false, lang: 'zh-TW' },
    { id: 8, text: 'Microphone access setting', button: false, lang: 'en' },
    { id: 8, text: '麥克風權限設定', button: false, lang: 'zh-TW' },
    { id: 9, text: 'If the microphone access has not been enabled, please refer to the following instructions. Setting it to “Always Allow” is recommended.', button: false, lang: 'en' },
    { id: 9, text: '若尚未開啟麥克風權限, 請參考以下說明, 並建議您設定為 "永遠允許"', button: false, lang: 'zh-TW' },
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly stateProvider: StateProvider,
    private readonly cdr: ChangeDetectorRef) {
    this.type = data.type;
   }

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });
  }
}
