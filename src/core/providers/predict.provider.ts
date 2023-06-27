import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {
  GenerateWavResponseInterface,
  AsrResponseInterface,
  DiagnosisRequestInterface,
  DiagnosisResponseInterface,
  PracticeResponseInterface
} from '../interfaces';
import {StateProvider} from './state.provider';
import {tap, map} from 'rxjs/operators';
import {EnvironmentService} from './environment.service';
import { type } from 'os';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class PredictProvider {
  apiUrl

  constructor(
    private readonly httpClient: HttpClient,
    private readonly stateProvider: StateProvider,
    private readonly environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.apiUrl;
  }

  public generateWav(text: string, gender?: string, ipa?: string): Observable<GenerateWavResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.post<GenerateWavResponseInterface>(`${this.apiUrl}/ml/tts`, {
      text,
      speed: 0.8,
      gender: gender,
      ipa: ipa
    }, options).pipe(tap(generatedAudio => this.stateProvider.generatedAudio$.next(generatedAudio)));
  }

  public addWav(text: string): Observable<GenerateWavResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.post<GenerateWavResponseInterface>(`${this.apiUrl}/userssentences/sentence`, {
      content: text
    }, options);
  }

  public getAsr(text: string, base64: string | ArrayBuffer, ipa: string): Observable<AsrResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    var base64Split = base64 as string
    var base64SplitOk = base64Split.split(',')[1]
    return this.httpClient.post<AsrResponseInterface>(`${this.apiUrl}/ml/gop_advanced`, {
      text,
      ipa,
      base64: base64SplitOk,
    }, options).pipe(
      map(x => {
        if (x && x.gop && x.gop.table_structure && x.gop.table_structure.data) {
          const tableStructure = Object.values(x.gop.table_structure.data).map(y => {
            return Object.values(y).map(z => z);
          });

          x.gop.table_structure.data = tableStructure;
        }

        return x;
      }),


      tap(asrResponse => this.stateProvider.asrResponse$.next(asrResponse))

      );
  }

  public postLog(asrResponse, id, type): Observable<AsrResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.post<AsrResponseInterface>(`${this.apiUrl}/exercises/log`, {
      object_id: id,
      type: type,
      score: asrResponse.gop.score_gop,
      scoring_diagnosis: asrResponse.scoring_diagnosis,
      user_voice: asrResponse.s3.user_voice,
      response_time: asrResponse.response_time,
    }, options).pipe();
  }

  public postPractice(practice): Observable<PracticeResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.post<PracticeResponseInterface>(`${this.apiUrl}/userssentences/practice`, practice, options).pipe();
  }

  public getDiagnosis(payload: DiagnosisRequestInterface): Observable<DiagnosisResponseInterface> {
    payload.token = localStorage.getItem('token');
    return this.httpClient.post<DiagnosisResponseInterface>(`${this.apiUrl}/diagnosis`, payload)
      .pipe(
        map(x => {
          if (x && x.data && x.data.table_structure && x.data.table_structure.data) {
            const tableStructure = Object.values(x.data.table_structure.data).map(y => {
              return Object.values(y).map(z => z);
            });

            x.data.table_structure.data = tableStructure;
          }

          return x;
        }),
        tap(diagnosisResponse => this.stateProvider.diagnosisResponse$.next(diagnosisResponse)),
      );
  }
}
