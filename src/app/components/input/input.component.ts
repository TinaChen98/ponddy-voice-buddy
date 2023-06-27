import {Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {Subscription} from 'rxjs';

import {LoadingProvider} from '../../../core/providers/loading.provider';
import {PredictProvider} from '../../../core/providers/predict.provider';
import {StateProvider} from '../../../core/providers/state.provider';
import {SentenceProvider} from '../../../core/providers/sentence.provider';
import {ErrorProvider} from '../../../core/providers/error.provider';
import { UserProvider } from './../../../core/providers/user.provider';
import {AudioProvider} from '../../../core/providers/audio.provider';
import {DomSanitizer} from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { inputDialog } from './input.component-popup';
import { inputUserDialog } from './input-user-popup.component';
import { inputDialoguesDialog } from './input-dialogues-popup.component';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() public text: string;
  public idsSentences;
  public idsSentencesPractices;
  public sentences;
  public countSentences;
  currentSentence;
  private currentTextSubscription: Subscription;
  private currentUserSelf: Subscription;
  userSelfContent;
  customizedStatus = false;
  dialoguesStatus = false;
  dialogues;
  dialogues_activeTopic;
  dialoguesTopic;
  dialoguesScenarios;
  // dialoguesSentences;
  topics;
  title;
  activeTopic;
  isTextVaild = true;
  type = 'ponddy_sentences'
  paginations = new Array;
  paginationNow;
  isPartDataback;
  // ponddy_sentences | customized_sentences | user_sentences
  nowLanguage;

  setLanguages = ['en', 'tw']

  languages = [
    { id: 1, text: 'Compose', button: false, lang: 'en' },
    { id: 1, text: '創建', button: false, lang: 'zh-TW' },
    { id: 2, text: 'CEFR Challenge', button: false, lang: 'en' },
    { id: 2, text: 'CEFR 挑戰', button: false, lang: 'zh-TW' },
    { id: 5, text: 'Conversation Topics', button: false, lang: 'en' },
    { id: 5, text: '主題對話', button: false, lang: 'zh-TW' },
    { id: 3, text: 'Pinned', button: false, lang: 'en' },
    { id: 3, text: '已釘選', button: false, lang: 'zh-TW' },
    { id: 4, text: 'Suggest more', button: false, lang: 'en' },
    { id: 4, text: '刷新句子', button: false, lang: 'zh-TW' },
  ]

  constructor(
    private readonly loadingProvider: LoadingProvider,
    private readonly predictProvider: PredictProvider,
    private readonly stateProvider: StateProvider,
    private readonly userProvider: UserProvider,
    private readonly sentenceProvider: SentenceProvider,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorProvider: ErrorProvider,
    private readonly audioProvider: AudioProvider,
    private readonly sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
  }

  public ngOnInit(): void {
    this.stateProvider.setLanguage$.asObservable().subscribe(setLanguage => {
      this.nowLanguage = setLanguage;
      this.cdr.detectChanges();
    });

    localStorage.setItem('practice', 'false')
    this.activeTopic = Number(localStorage.getItem('activeTopic'))
    localStorage.removeItem('activeTopic');
    localStorage.removeItem('practiceLog');
    localStorage.removeItem('savedState');
    localStorage.removeItem('isUserPlayback');
    localStorage.removeItem('userAudio');
    localStorage.removeItem('currentSentence');
    localStorage.removeItem('base64');
    localStorage.removeItem('userAudioUrl');
    localStorage.removeItem('tts');
    if(localStorage.getItem('type')) this.type = localStorage.getItem('type')
    this.currentTextSubscription = this.stateProvider.currentSentence$.asObservable().subscribe(sentence => {
      this.text = sentence ? sentence.en : null;
      this.currentSentence = sentence;
      this.cdr.detectChanges();
    });
    this.getUserSelf();
  }


  getUserSelf() {
    this.loadingProvider.startLoading();
    this.currentUserSelf = this.stateProvider.userSelf$.asObservable().subscribe(userContent => {
      this.userSelfContent = userContent;
      this.cdr.detectChanges();
    });
    if(this.userSelfContent===null){
      this.userSelf();
    } else {
      if(this.userSelfContent.group === 1){
        this.customizedStatus = true;
        this.getCustomizedTopic();
      } else if(this.userSelfContent.group === 2){
        //TODO: 對話
        this.dialoguesStatus = true;
        this.getThemedDialoguesTopic();
      } else {
        this.refreshSentences(0, this.type);
      }
    }
  }

  public userSelf(): void {
    this.userProvider.userSelf()
      .subscribe(
        userSelf => {
          this.userSelfContent = userSelf;
          if(this.userSelfContent.group === 1){
            this.customizedStatus = true;
            this.getCustomizedTopic();
          } else if(this.userSelfContent.group === 2){
            //TODO: 對話
            this.dialoguesStatus = true;
            this.getThemedDialoguesTopic();
          } else {
            this.refreshSentences(0, this.type);
          }
        },
        error => {
          console.error({error});
        },
      );
  }

  getCustomizedTopic() {
    this.sentenceProvider.getCustomizedTopic(this.userSelfContent.group).subscribe(groupDetail => {
      // console.log(groupDetail)
      this.topics = groupDetail.topic;
      this.topics = this.topics.sort()
      this.title = groupDetail.title;
      if(localStorage.getItem('currentSentence')){
        this.goHome();
      } else {
        this.refreshSentences(0, this.type);
      }

      this.cdr.detectChanges();
    });
  }

  getThemedDialoguesTopic() {
    this.sentenceProvider.getThemedDialoguesTopic(this.userSelfContent.group).subscribe(groupDetail => {
      this.dialogues = groupDetail.results;
      if(localStorage.getItem('currentSentence')){
        this.goHome();
      } else {
        this.refreshSentences(0, this.type);
      }

      this.cdr.detectChanges();
    });
  }

  goHome() {
    let sentenceType = JSON.parse(localStorage.getItem('currentSentence'));
    if(localStorage.getItem('type')) {
      this.type = localStorage.getItem('type');
      localStorage.removeItem('type');
    } else {
      this.type = sentenceType.type;
    }

    if(this.type === 'user_sentences'){
      this.type = 'pin_sentences';
    }

    this.refreshSentences(this.topics.indexOf(sentenceType.topic), this.type);
  }

  public ngOnDestroy(): void {
    if (this.currentTextSubscription) {
      this.currentTextSubscription.unsubscribe();
    }
  }

  changeType(type) {
    this.type = type
    this.paginations = [];
    this.paginationNow = 0;
    this.activeTopic = 0;
    this.dialogues_activeTopic = 0;
    localStorage.setItem('type', this.type);
    this.refreshSentences(0, type, false);
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
    this.currentSentence = {
      ch: '', en: text
    };
  }

  public setText(text: string): void {
    this.isTextVaild = true;
    this.text = text;
    this.currentSentence = this.sentences.filter(res => res.content === this.text)[0];
    this.generateVoice();
    this.cdr.detectChanges();
  }

  public refreshSentences(id, type, reload?): void {
    console.log(id)
    this.loadingProvider.startLoading();
    if(type=='ponddy_sentences') {
      this.sentenceProvider.getPonddySentences().subscribe(sentences => {
        this.sentences = sentences;
        this.paginationSum();
        this.cdr.detectChanges();
      });
    } else if(type=='customized_sentences'){
      this.topicList(this.activeTopic, this.topics[this.activeTopic],reload)
    } else if(type=='dialogues_sentences'){
      this.dialoguesList(id, this.dialogues[id])
    } else if(type=='pin_sentences') {
      this.userList(reload)
    }
  }

  getVoiceExercises (){
    let type = this.type;
    let idsSentence =  new Array;
    let idsSentencesPractice =  new Array;

    if(this.type != 'pin_sentences') {
      for(var i=0;i<Object.keys(this.sentences).length;i++){
        if(this.sentences[i].type === 'practice_sentences') {
          idsSentencesPractice.push(this.sentences[i].practice_id);
        } else {
          idsSentence.push(this.sentences[i].id);
        }
      }

      if(idsSentence.length) {
        this.sentenceProvider.getVoiceExercises(type, idsSentence).subscribe(voice => {
          this.idsSentences = voice.result;
          this.loadingProvider.stopLoading();
          this.cdr.detectChanges();
        });
      }
      if(idsSentencesPractice.length) {
        this.sentenceProvider.getVoiceExercises('practice_sentences', idsSentencesPractice).subscribe(voice => {
          this.idsSentencesPractices = voice.result;
          this.loadingProvider.stopLoading();
          this.cdr.detectChanges();
        });
      }
    } else {
      this.loadingProvider.stopLoading();
    }

    if(this.type != 'ponddy_sentences') {
      localStorage.setItem('paginationNow', this.paginationNow);
      localStorage.setItem('activeTopic', this.activeTopic);
    }
    localStorage.setItem('type', this.type);
  }

  public playPartData(audioUrl, id) {
    this.isPartDataback = id
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(audioUrl);
    this.stateProvider.partDataAudio$.next(safeUrl);
    this.audioProvider.playPartDataAudio('');
  }

  public stopPartData(): void {
    this.audioProvider.stopPartDataAudio();
  }

  public pinSentences(id, type, saved, $event) {
    this.loadingProvider.startLoading();
    this.sentenceProvider.postSentencesPin(id, type, saved).subscribe(pinSentences => {
      if(this.type === 'ponddy_sentences') {
          var nowId;
          for(var i=0;i<this.sentences.length;i++){
            if(this.sentences[i].id===id){
              nowId = i
            }
          }
          this.sentenceProvider.getPinState(id).subscribe(pinState => {
            this.sentences[nowId] = pinState
            this.loadingProvider.stopLoading();
            this.cdr.detectChanges();
          });
      } else {
        this.paginationClick(this.type, this.paginationNow)
      }
      this.cdr.detectChanges();
    },
    error => {
      console.error({error});
      this.loadingProvider.stopLoading();
      if (error) {
        this.errorProvider.errorMessage$.next(error.error.detail);
      } else {
        this.errorProvider.errorMessage$.next('Failed to get simple analysis, please try it again later!');
      }
    },);
  }

  public generateVoice(): void {
    this.loadingProvider.startLoading();
    if(this.type != 'ponddy_sentences') {
      localStorage.setItem('paginationNow', this.paginationNow.toString());
      localStorage.setItem('activeTopic', this.activeTopic.toString());
    }
    localStorage.setItem('type', this.type);

    if(this.text == this.currentSentence.content){
      this.currentSentence.content = this.currentSentence.content.replace("’", "'");
      localStorage.setItem('currentSentence', JSON.stringify(this.currentSentence));
      this.stateProvider.currentSentence$.next(this.currentSentence);
      this.pinState(this.currentSentence.id, this.currentSentence.type, this.currentSentence.saved)
      this.stateProvider.setStep(1);
      this.loadingProvider.stopLoading();
    } else {
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
  }

  public pinState(id, type, saved) {
    if(type=='ponddy_sentences'){
      this.sentenceProvider.getPinState(id).subscribe(pinState => {
        this.stateProvider.savedState(pinState.saved);
        this.loadingProvider.stopLoading();
        this.cdr.detectChanges();
      });
    } else {
      this.stateProvider.savedState(saved);
    }
  }

  topicList(id, topic, reload?) {
    this.loadingProvider.startLoading();
    this.activeTopic = id;
    if(reload === undefined) {
      !localStorage.getItem('paginationNow') ? this.paginationNow = 0 : this.paginationNow = Number(localStorage.getItem('paginationNow'));
    } else {
      this.paginationNow = 0;
    }
    localStorage.removeItem('paginationNow');

    this.sentenceProvider.getCustomizedSentencesPagination(this.userSelfContent.group, this.topics[this.activeTopic], this.paginationNow+1).subscribe(sentences => {
        this.countSentences = sentences.count;
        this.sentences = sentences.results;
        this.paginationSum();
        var styleTopic = document.getElementsByClassName("carousel-cells") as HTMLCollectionOf<HTMLElement>;
        if(window.innerWidth < 678 ){
          styleTopic[0].style.transform = 'translateX(-'+((this.activeTopic-2)*96)+'px)';
        } else {
          styleTopic[0].style.transform = 'translateX(-'+((this.activeTopic-6)*96)+'px)';
        }
        this.cdr.detectChanges();
      });
  }

  dialoguesList(id, dialogues, reload?) {
    this.dialogues_activeTopic = id;
    this.dialoguesTopic = dialogues;
    this.dialoguesScenarios = dialogues.scenarios;
    this.sentences = null;
    // 儲存目前主題
    this.stateProvider.dialoguesTopic$.next(this.dialoguesTopic);

    this.cdr.detectChanges();
    this.loadingProvider.stopLoading();
  }

  clickDialoguesScenarios(id) {
    // 儲存選擇對話 id
    this.stateProvider.dialoguesScenariosId$.next(id);
    this.dialog.open(inputDialoguesDialog, { disableClose: true });
  }

  userList(reload?) {
    if(reload === undefined) {
      !localStorage.getItem('paginationNow') ? this.paginationNow = 0 : this.paginationNow = Number(localStorage.getItem('paginationNow'));
    } else {
      this.paginationNow = 0;
    }
    localStorage.removeItem('paginationNow');

    this.sentences = [];
      this.sentenceProvider.getPinSentencesPagination(this.paginationNow+1).subscribe(sentences => {
        for(var i=0;i<Object.keys(sentences.results).length;i++){
          this.sentences.push(sentences.results[i].sentence);
        }
        this.countSentences = sentences.count;

        this.paginationSum();
        this.cdr.detectChanges();
      });
  }

  paginationSum() {
    let sum = this.countSentences/10;
    this.paginations = [];
    for(var i=0;i<sum;i++){
      this.paginations.push(i)
    }

    this.getVoiceExercises();
  }


  paginationClick (type, page){
    this.loadingProvider.startLoading();
    this.paginationNow = page;

    if(type === 'customized_sentences') {
      this.sentenceProvider.getCustomizedSentencesPagination(this.userSelfContent.group, this.topics[this.activeTopic], this.paginationNow+1).subscribe(sentences => {
        this.sentences = sentences.results;
        var styleTopic = document.getElementsByClassName("carousel-cells") as HTMLCollectionOf<HTMLElement>;
        if(window.innerWidth < 678 ){
          styleTopic[0].style.transform = 'translateX(-'+((this.activeTopic-2)*96)+'px)';
        } else {
          styleTopic[0].style.transform = 'translateX(-'+((this.activeTopic-6)*96)+'px)';
        }
        this.getVoiceExercises();
        this.cdr.detectChanges();
      });
    } else if(type === 'pin_sentences'){
      this.sentenceProvider.getPinSentencesPagination(this.paginationNow+1).subscribe(sentences => {
        this.sentences = [];
        for(var i=0;i<Object.keys(sentences.results).length;i++){
          this.sentences.push(sentences.results[i].sentence);
        }
        this.countSentences = sentences.count;
        this.getVoiceExercises();
        this.cdr.detectChanges();
      });
    }
  }

  openDialog(sentences_i) {
    this.dialog.open(inputDialog, {
      data: {
        level_cefr_name: this.sentences[sentences_i].level_cefr_name,
        level_cefr: this.sentences[sentences_i].level_cefr,
        label: this.sentences[sentences_i].label,
        level_cefr_color: this.sentences[sentences_i].level_cefr_color,
        currentSentence: this.currentSentence,
        topic: this.topics[this.activeTopic],
        object_id: this.sentences[sentences_i].id,
        content: this.sentences[sentences_i].content,
        type: this.sentences[sentences_i].type,
        practice_id: this.sentences[sentences_i].practice_id,
        ipa: this.sentences[sentences_i].ipa,
        saved: this.sentences[sentences_i].saved
      },
    });
  }

  openUserDialog() {
    this.dialog.open(inputUserDialog);
  }
}
