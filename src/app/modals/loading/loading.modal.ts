import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingProvider } from '../../../core/providers/loading.provider';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.modal.html',
  styleUrls: ['./loading.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingModalComponent implements OnInit, OnDestroy {
  public isLoading: boolean;

  private loadingSubscription: Subscription;

  constructor(
    private readonly loadingProvider: LoadingProvider,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.loadingSubscription = this.loadingProvider.isLoading$.asObservable().subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
