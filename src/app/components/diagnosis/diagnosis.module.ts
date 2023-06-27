import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosisComponent } from './diagnosis.component';
import { ProgressCircleModule } from '../progress-circle/progress-circle.module';
import { ButtonModule } from '../button/button.module';
import { DialogDataExampleDialog } from './diagnosis.component-popup';

@NgModule({
  declarations: [DiagnosisComponent, DialogDataExampleDialog],
  imports: [
    CommonModule,
    ProgressCircleModule,
    ButtonModule,
  ],
  exports: [DiagnosisComponent, DialogDataExampleDialog],
})
export class DiagnosisModule { }
