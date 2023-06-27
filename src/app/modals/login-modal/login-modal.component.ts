import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  url;
  authUrl = 'https://auth-dev.ponddy.com/auth/';
  clientId = 'e7266342-a529-4253-a3c5-4105abb5c8d6';

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>) {
    const hostUrl = location.href;
    if (hostUrl.includes('voicebuddy.ponddy') || hostUrl.includes('voicebuddy.iponddy')) {
      this.authUrl = 'https://auth.ponddy.com/auth';
      this.clientId = 'c6af148e-438e-4257-babf-cb6cbbb6c540';
    }
    this.url = this.authUrl + '?client_id=' + this.clientId + '&redirect_uri=' + hostUrl + '&next=diagnosis';
  }

  ngOnInit(): void {
  }

}
