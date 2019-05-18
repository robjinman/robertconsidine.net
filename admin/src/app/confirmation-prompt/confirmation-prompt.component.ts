import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmationPromptData {
  message: string
}

@Component({
  selector: 'app-confirmation-prompt',
  templateUrl: './confirmation-prompt.component.html',
  styleUrls: ['./confirmation-prompt.component.styl']
})
export class ConfirmationPromptComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmationPromptComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationPromptData) { }

  ngOnInit() {
  }
}
