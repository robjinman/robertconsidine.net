import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { File } from '../types';
import { FileService } from '../file.service';
import { base64ArrayBuffer } from '../base64';

interface FileToUpload {
  fullName: string;
  name: string;
  extension: string;
  file: any;
}

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.styl']
})
export class AttachmentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() documentId: string;
  @Input() files: File[];
  displayedColumns: string[] = [
    'name',
    'id'
  ];
  fileToUpload: FileToUpload = {
    fullName: null,
    name: null,
    extension: null,
    file: null
  };

  constructor(private fileService: FileService) { }

  ngOnInit() {}

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  upload() {
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.fileToUpload.file);

    reader.onload = (e: any) => {
      const data = base64ArrayBuffer(e.target.result);

      this.fileService.uploadFile({
        documentId: this.documentId,
        data: data,
        name: this.fileToUpload.name,
        extension: this.fileToUpload.extension
      }).pipe(take(1)).subscribe();
    }
  }

  onFileSelected() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      const file = files[0];
      const parts = file.name.split('.');

      this.fileToUpload.file = file;
      this.fileToUpload.fullName = file.name;
      this.fileToUpload.name = parts[0];
      if (parts.length > 1) {
        this.fileToUpload.extension = parts[parts.length - 1];
      }
    }
  }
}
