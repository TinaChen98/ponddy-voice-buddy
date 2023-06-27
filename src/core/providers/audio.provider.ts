import { Injectable, Inject, } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import * as RecordRTC from 'recordrtc';
import { BehaviorSubject } from 'rxjs';

import { StateProvider } from './state.provider';

@Injectable({
  providedIn: 'root',
})
export class AudioProvider {
  public recordingTimer$: BehaviorSubject<string> = new BehaviorSubject(`00:00`);
  public blobUrl$: BehaviorSubject<SafeUrl> = new BehaviorSubject(null);
  public blob$: BehaviorSubject<Blob> = new BehaviorSubject(null);
  public base64$: BehaviorSubject<string | ArrayBuffer> = new BehaviorSubject(null);
  public isRecording$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isAiPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isUserPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isPartDataPlaying$: BehaviorSubject<string> = new BehaviorSubject('');


  private aiAudioPlayer: any;
  private userAudioPlayer: any;
  private partDataAudioPlayer: any;


  private mediaRecordStream: MediaStream;
  private recordWebRTC: RecordRTC.StereoAudioRecorder;
  private interval: any;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly sanitizer: DomSanitizer,
    private readonly stateProvider: StateProvider,
  ) {}

  public reloadAiSource(): void {
    if (!this.aiAudioPlayer) {
      this.aiAudioPlayer = this.document.getElementById('ai-audio-player') as any;
      this.aiAudioPlayer.addEventListener('pause', this.aiPauseListener.bind(this));
    }
    if (this.aiAudioPlayer) {
      this.aiAudioPlayer.load();
    }
  }

  public reloadUserSource(): void {
    if (!this.userAudioPlayer) {
      this.userAudioPlayer = this.document.getElementById('user-audio-player') as any;
      this.userAudioPlayer.addEventListener('pause', this.userPauseListener.bind(this));
    }
    if (this.userAudioPlayer) {
      this.userAudioPlayer.load();
    }
  }
  public reloadPartDataSource(): void {
    if (this.partDataAudioPlayer) {
      this.partDataAudioPlayer.load();
    }
  }
  public playAiAudio(): void {
    this.stopUserAudio();
    if (this.isRecording$.getValue()) {
      this.isRecording$.next(false);
      this.stopRTC();
    }
    if (!this.aiAudioPlayer) {
      this.aiAudioPlayer = this.document.getElementById('ai-audio-player') as any;
      this.aiAudioPlayer.addEventListener('pause', this.aiPauseListener.bind(this));
    }
    if (this.aiAudioPlayer) {
      this.isAiPlaying$.next(true);
      this.aiAudioPlayer.play();
      this.aiAudioPlayer.volume = 1;

      navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        let msg ='';
        devices.forEach(function(device) {
          msg += device.kind + ": " + device.label + " id = " + device.deviceId + "/"
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });

    }
  }

  public stopAiAudio(): void {
    if (this.aiAudioPlayer) {
      this.aiAudioPlayer.pause();
      this.aiAudioPlayer.currentTime = 0;
    }
  }

  public playUserAudio(): void {
    this.stopAiAudio();
    if (this.isRecording$.getValue()) {
      this.isRecording$.next(false);
      this.stopRTC();
    }
    if (!this.userAudioPlayer) {
      this.userAudioPlayer = this.document.getElementById('user-audio-player') as any;
      this.userAudioPlayer.addEventListener('pause', this.userPauseListener.bind(this));
    }

    if (this.userAudioPlayer) {
      this.isUserPlaying$.next(true);
      this.userAudioPlayer.play();
    }
  }

  public stopUserAudio(): void {
    if (this.userAudioPlayer) {
      this.userAudioPlayer.pause();
      this.userAudioPlayer.currentTime = 0;
    }
  }
  public playPartDataAudio(position) {
    this.stopAiAudio();
    this.stopUserAudio();
    if (this.isRecording$.getValue()) {
      this.isRecording$.next(false);
      this.stopRTC();
    }
    if (!this.partDataAudioPlayer) {
      this.partDataAudioPlayer = this.document.getElementById('data-part-audio-player') as any;
      this.partDataAudioPlayer.addEventListener('pause', this.partDataListener.bind(this));

    }
    if (this.partDataAudioPlayer) {
      this.isPartDataPlaying$.next(position);
      this.partDataAudioPlayer.play();
    }
  }
  public stopPartDataAudio(): void {
    if (this.partDataAudioPlayer) {
      this.partDataAudioPlayer.pause();
      this.partDataAudioPlayer.currentTime = 0;
    }
  }

  public toggleRecord() {
    return new Promise((resolve ,reject)=>{
      this.stopAiAudio();
      this.stopUserAudio();
      let errorStatus;
      if (this.recordingTimer$.getValue() !== `00:00`) {
        this.isRecording$.next(false);
        this.stopRTC().then((res)=>{
            resolve("Resolved");
        }).catch((error)=>{
            reject("Rejected")
        });
      } else {
        errorStatus = navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.startRTC(stream);
          this.isRecording$.next(true);
        }).catch(error => {
          console.error(error);
          return 'error'
        });
        return errorStatus
      }
    })
  }

  private aiPauseListener(): void {
    this.isAiPlaying$.next(false);
  }

  private userPauseListener(): void {
    this.isUserPlaying$.next(false);
  }
  private partDataListener() {
    this.isPartDataPlaying$.next('');
  }
  private stopRTC(): any {
    return new Promise((resolve ,reject)=>{
      this.recordWebRTC.stop((blob: Blob) => {
        this.blob$.next(blob);
        const objectURL = URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          localStorage.setItem('base64', base64data.toString());
          this.base64$.next(base64data);
          resolve("Resolved");
        };
        const escapedUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.blobUrl$.next(escapedUrl);
        this.stateProvider.userAudio$.next(escapedUrl);
        this.startCountdown(true);
      });
  });



  }

  private startRTC(stream: MediaStream): void {
    this.recordWebRTC = new RecordRTC.StereoAudioRecorder(stream, {
      bufferSize: 16384,
      numberOfAudioChannels: 1,
    });
    localStorage.setItem('base64', '');
    this.mediaRecordStream = stream;
    this.blobUrl$.next(null);
    this.blob$.next(null);
    this.recordWebRTC.record();
    this.startCountdown();
  }

  private startCountdown(clearTime = false): void {
    if (clearTime) {
      this.clearStream(this.mediaRecordStream);
      this.recordWebRTC = null;
      this.recordingTimer$.next(`00:00`);
      this.mediaRecordStream = null;
      clearInterval(this.interval);

      return;
    } else {
      this.recordingTimer$.next(`00:00`);
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      let timer: any = this.recordingTimer$.getValue();
      timer = timer.split(':');
      let minutes = +timer[0];
      let seconds = +timer[1];

      if (minutes === 10) {
        this.recordWebRTC.stopRecording();
        clearInterval(this.interval);

        return;
      }
      ++seconds;
      if (seconds >= 59) {
        ++minutes;
        seconds = 0;
      }

      if (seconds < 10) {
        this.recordingTimer$.next(`0${minutes}:0${seconds}`);
      } else {
        this.recordingTimer$.next(`0${minutes}:${seconds}`);
      }
    }, 1000);
  }

  public clearStream(stream: any): void {
    try {
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
      if(localStorage.getItem("type") != 'dialogues_sentences') {
        // 若為主題對話則不重整
        location.href = location.href;
      }
    } catch (error) {
      console.error(error);
    }
    stream.onvolumechange = (event) => {
      console.log('The volume changed.');
    };
  }
}
