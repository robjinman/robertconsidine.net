import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { Page } from '../types';
import { PageService } from '../page.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

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
              private snackbar: MatSnackBar) { }

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
    this.router.navigate(['/pages']);
  }

  delete() {
    this.pageService.deletePage(this.page.id)
      .pipe(take(1))
      .subscribe(() => {
        this.snackbar.open('Page deleted', 'Dismiss', SUCCESS_SNACKBAR_OPTIONS);
      }, () => {
        this.snackbar.open('Error deleting page', 'Dismiss',
                           ERROR_SNACKBAR_OPTIONS);
      });
  }
}
