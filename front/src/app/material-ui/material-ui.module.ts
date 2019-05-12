import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatCardModule,
  MatTabsModule,
  MatIconModule,
  MatChipsModule,
  MatSnackBarModule
} from '@angular/material';

const modules = [
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatCardModule,
  MatTabsModule,
  MatIconModule,
  MatChipsModule,
  MatSnackBarModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules
  ]
})
export class MaterialUiModule { }
