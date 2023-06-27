import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import * as Components from './components';
import {ModalsModule} from './modals/modals.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [

  {path: '', component: AppComponent},
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    Components.ProgressModule,
    Components.StepContainerModule,
    Components.HomeModule,
    Components.InputModule,
    Components.SpeakModule,
    Components.ResultModule,
    Components.DiagnosisModule,
    Components.DialoguesModule,
    MatDialogModule,
    ModalsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
