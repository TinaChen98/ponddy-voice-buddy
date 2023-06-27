import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';


import {CustomizedSentencesResponseInterface, PonddySentencesResponseInterface, PinSentencesResponseInterface, CustomizedTopicResponseInterface, VoiceExercisesResponseInterface, ThemedDialoguesTopicResponseInterface, ThemedDialoguesScenarioResponseInterface} from '../interfaces';
import {EnvironmentService} from "./environment.service";

@Injectable({
  providedIn: 'root',
})
export class SentenceProvider {
  apiUrl

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.apiUrl;
  }

  public getVoiceExercises(type, ids): Observable<VoiceExercisesResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);

    const body = {
      type: type,
      ids: ids
    }

    options["headers"] = headers;

    return this.httpClient.post<VoiceExercisesResponseInterface>(`${this.apiUrl}/exercises/sentences/voice`, body, options);
  }

  public getPonddySentences(): Observable<PonddySentencesResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<PonddySentencesResponseInterface>(`${this.apiUrl}/sentences/sentence/suggest`, options);
  }

  public getCustomizedTopic(group_id): Observable<CustomizedTopicResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<CustomizedTopicResponseInterface>(`${this.apiUrl}/customized/customized_group/${group_id}`, options);
  }

  public getCustomizedSentencesPagination(group_id, topic, page): Observable<CustomizedSentencesResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<CustomizedSentencesResponseInterface>(`${this.apiUrl}/customized/sentence?customized_group_id=${group_id}&topic=${topic}&page=${page}`, options);
  }

  public getThemedDialoguesTopic(group_id): Observable<ThemedDialoguesTopicResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<ThemedDialoguesTopicResponseInterface>(`${this.apiUrl}/customized/dialogues/theme`, options);
  }

  public getThemedDialoguesScenario(id): Observable<ThemedDialoguesScenarioResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<ThemedDialoguesScenarioResponseInterface>(`${this.apiUrl}/customized/dialogues/scenario/${id}`, options);
  }


  public getPinSentencesPagination(page): Observable<PinSentencesResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<PinSentencesResponseInterface>(`${this.apiUrl}/users/saved?page=${page}`, options);
  }

  public postSentencesPin(id: number, type: string, saved: boolean) {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    saved = (saved)?false:true

    const body = {
      "id": id,
      "type": type,
      "saved": saved
    }
    return this.httpClient.post(`${this.apiUrl}/users/saved`, body, options)
  }

  public getPinState(id: any): Observable<PonddySentencesResponseInterface> {
    let options = new Object();
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set("Authorization", `SSO ${token}`);
    options["headers"] = headers;

    return this.httpClient.get<PonddySentencesResponseInterface>(`${this.apiUrl}/sentences/sentence/${id}`, options);
  }
}
