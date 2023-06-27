import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepContainerComponent } from './step-container.component';

@NgModule({
  declarations: [StepContainerComponent],
  imports: [
    CommonModule,
  ],
  exports: [StepContainerComponent],
})
export class StepContainerModule { }
