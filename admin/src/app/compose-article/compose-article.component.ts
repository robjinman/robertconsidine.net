import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { Article } from '../types';
import { ArticleService } from '../article.service';
import { ERROR_SNACKBAR_OPTIONS } from '../utils';

@Component({
  selector: 'app-compose',
  templateUrl: './compose-article.component.html',
  styleUrls: ['./compose-article.component.styl']
})
export class ComposeArticleComponent implements OnInit {
  article: Article = {
    id: null,
    draft: true,
    createdAt: null,
    modifiedAt: null,
    publishedAt: null,
    title: '',
    summary: '',
    content: '',
    tags: [],
    files: [],
    comments: []
  };

  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private router: Router,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.article.id = this.route.snapshot.queryParams['id'];

    if (this.article.id) {
      this.articleService.getArticle(this.article.id)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
        }, () => {
          this.snackbar.open('Failed to load article', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
          this.article = null;
        });
    }
  }

  save() {
    if (this.article.id) {
      this.articleService.updateArticle(this.article)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
        });
    }
    else {
      this.articleService.postArticle(this.article)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
        });
    }
  }

  cancel() {
    this.router.navigate(['/articles']);
  }

  delete() {
    this.articleService.deleteArticle(this.article.id)
      .pipe(take(1))
      .subscribe();
  }

  togglePublished() {
    let publish = this.article.draft;

    this.articleService.publishArticle(this.article.id, publish)
      .pipe(take(1))
      .subscribe(() => {
        this.article.draft = !publish;
      });
  }
}
