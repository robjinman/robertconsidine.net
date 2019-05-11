import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { TagFieldData } from './tag-field-data';
import { ArticleService } from '../article.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.styl'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsSelectorComponent),
      multi: true
    }
  ]
})
export class TagsSelectorComponent implements ControlValueAccessor {
  newTagName: string;
  private _value: TagFieldData[] = [];

  constructor(private articleService: ArticleService,
              private snackbar: MatSnackBar) {}

  get value(): TagFieldData[] {
    return this._value;
  }

  writeValue(value: TagFieldData[]) {
    this._value = value;
  }

  registerOnChange(fn: (value: TagFieldData[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  onChange = (value: TagFieldData[]) => {}
  onTouched = () => {}

  addTag(value: string) {
    this.articleService.postTag(value)
      .pipe(take(1))
      .subscribe(() => {
        this.snackbar.open('Tag created', 'Dismiss',
                           SUCCESS_SNACKBAR_OPTIONS);
      }, () => {
        this.snackbar.open('Error creating tag', 'Dismiss',
                           ERROR_SNACKBAR_OPTIONS);
      });
  }
}
