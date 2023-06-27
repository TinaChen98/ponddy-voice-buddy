import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorProvider {
  public errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
  public errorCode$: BehaviorSubject<string> = new BehaviorSubject(null);
}
