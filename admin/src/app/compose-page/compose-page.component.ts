import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';

import { Page } from '../types';
import { PageService } from '../page.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';
import {
  ConfirmationPromptComponent
} from '../confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-compose-page',
  templateUrl: './compose-page.component.html',
  styleUrls: ['./compose-page.component.styl']
})
export class ComposePageComponent implements OnInit {
  page: Page = {
    id: null,
    name: null,
    content: null,
    files: []
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pageService: PageService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.page.name = this.route.snapshot.queryParams['name'];

    if (this.page.name) {
      this.pageService.getPage(this.page.name)
        .pipe(take(1))
        .subscribe(page => {
          this.page = page;
        }, () => {
          this.snackbar.open('Error loading page', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
          this.page = null;
        });
    }
  }

  save() {
    if (this.page.id) {
      this.pageService.updatePage(this.page)
        .pipe(take(1))
        .subscribe(page => {
          this.snackbar.open('Page saved', 'Dismiss', SUCCESS_SNACKBAR_OPTIONS);
          this.page = page;
        }, () => {
          this.snackbar.open('Error saving page', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        });
    }
    else {
      this.pageService.postPage(this.page)
        .pipe(take(1))
        .subscribe(page => {
          this.snackbar.open('Page saved', 'Dismiss', SUCCESS_SNACKBAR_OPTIONS);
          this.page = page;
        }, () => {
          this.snackbar.open('Error saving page', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        });
    }
  }

  cancel() {
    const dialog = this.dialog.open(ConfirmationPromptComponent, {
      data: {
        message: 'Are you sure you want to proceed? Any pending changes will' +
                 ' be lost.'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/pages']);
      }
    });
  }

  delete() {
    const dialog = this.dialog.open(ConfirmationPromptComponent, {
      data: {
        message: 'Are you sure you want to delete this page?'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.pageService.deletePage(this.page.name)
        .pipe(take(1))
        .subscribe(() => {
          this.snackbar.open('Page deleted', 'Dismiss',
                             SUCCESS_SNACKBAR_OPTIONS);
          this.router.navigate(['/pages']);
        }, () => {
          this.snackbar.open('Error deleting page','Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        });
      }
    });
  }
}
