import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoadingModalComponent} from './loading/loading.modal';
import {ErrorModalComponent} from './error/error.modal';
import {ButtonModule} from '../components';
import { LoginModalComponent } from './login-modal/login-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import { HeaderComponent } from './header/header.component';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    MatDialogModule,
    MatMenuModule
  ],
  declarations: [
    LoadingModalComponent,
    ErrorModalComponent,
    LoginModalComponent,
    HeaderComponent,
  ],
  exports: [
    LoadingModalComponent,
    ErrorModalComponent,
    HeaderComponent,
  ],
  entryComponents: [LoginModalComponent]
})
export class ModalsModule {
}
