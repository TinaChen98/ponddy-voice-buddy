import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultComponent } from './result.component';
import { ProgressCircleModule } from '../progress-circle/progress-circle.module';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [ResultComponent],
  imports: [
    CommonModule,
    ProgressCircleModule,
    ButtonModule,
  ],
  exports: [ResultComponent],
})
export class ResultModule { }
