import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit{
  @Input() public isDisabled: boolean;
  @Input() public isSmallBtn: boolean;
  @Input() public isFilled: boolean;
  @Input() public isStop: boolean;
  @Input() public isWidthFull: boolean;

  ngOnInit() {
    if(this.isSmallBtn != true) {
      this.isSmallBtn = false
    }
  }
}
