import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingProvider {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public startLoading(): void {
    this.isLoading$.next(true);
  }

  public stopLoading(): void {
    this.isLoading$.next(false);
  }
}
