import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpeakComponent } from './speak.component';
import { ButtonModule } from '../button/button.module';
import { SpeakDialog } from './speak-popup.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [SpeakComponent, SpeakDialog],
  imports: [
    CommonModule,
    ButtonModule,
    MatDialogModule
  ],
  exports: [SpeakComponent],
})
export class SpeakModule { }
