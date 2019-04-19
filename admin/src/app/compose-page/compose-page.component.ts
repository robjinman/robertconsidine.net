import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { Page } from '../types';
import { PageService } from '../page.service';

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
              private pageService: PageService) { }

  ngOnInit() {
    this.page.name = this.route.snapshot.queryParams['name'];

    if (this.page.name) {
      this.pageService.getPage(this.page.name)
        .pipe(take(1))
        .subscribe(page => {
          this.page = page;
        });
    }
  }

  save() {
    if (this.page.id) {
      this.pageService.updatePage(this.page)
        .pipe(take(1))
        .subscribe(page => {
          this.page = page;
        });
    }
    else {
      this.pageService.postPage(this.page)
        .pipe(take(1))
        .subscribe(page => {
          this.page = page;
        });
    }
  }

  cancel() {
    this.router.navigate(['/pages']);
  }

  delete() {
    this.pageService.deletePage(this.page.id)
      .pipe(take(1))
      .subscribe();
  }
}
