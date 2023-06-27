import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';

import {ErrorProvider} from '../../../core/providers/error.provider';

@Component({
  selector: 'app-error',
  templateUrl: './error.modal.html',
  styleUrls: ['./error.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModalComponent implements OnInit, OnDestroy {
  public isError: boolean;
  public errorMsg: string;
  public errorCode: string;
  private errorSubscription: Subscription;
  private errorCodeSubscription: Subscription;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly errorProvider: ErrorProvider,
  ) {
  }

  public ngOnInit(): void {
    this.errorSubscription = this.errorProvider.errorMessage$.asObservable().subscribe(errorMsg => {
      if (errorMsg) {
        this.isError = true;
        this.errorMsg = errorMsg;
      } else {
        this.isError = false;
        this.errorMsg = null;
      }
      this.cdr.detectChanges();
    });
    this.errorCodeSubscription = this.errorProvider.errorCode$.asObservable().subscribe(errorCode => {
      if (errorCode) {
        this.isError = true;
        this.errorCode = errorCode;
      } else {
        this.isError = false;
        this.errorCode = null;
      }
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  public dismiss(): void {
    this.errorProvider.errorMessage$.next(null);
  }
}
