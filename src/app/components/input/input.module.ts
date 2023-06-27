import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputComponent } from './input.component';
import { ButtonModule } from '../button/button.module';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { inputDialog } from './input.component-popup';
import { inputUserDialog } from './input-user-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { inputDialoguesDialog } from './input-dialogues-popup.component';


@NgModule({
  declarations: [InputComponent, inputDialog, inputUserDialog, inputDialoguesDialog],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    IvyCarouselModule,
    MatDialogModule
  ],
  exports: [InputComponent],
})
export class InputModule { }
