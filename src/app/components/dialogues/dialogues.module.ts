import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialoguesComponent } from './dialogues.component';
import { ButtonModule } from '../button/button.module';
import { DialoguesPopupDialog } from './dialogues-popup.component';

@NgModule({
  declarations: [DialoguesComponent, DialoguesPopupDialog],
  imports: [
    CommonModule,
    ButtonModule,
  ],
  exports: [DialoguesComponent, DialoguesPopupDialog],
})
export class DialoguesModule { }
