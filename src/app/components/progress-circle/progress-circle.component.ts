import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCircleComponent {
  @Input() public progress: number;
  @Input() public color = '#3B9FBE';
  @Input() public size = '144px';
}
