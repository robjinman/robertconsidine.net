import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { Article } from '../types';
import { ArticleService } from '../article.service';
import { ERROR_SNACKBAR_OPTIONS, SUCCESS_SNACKBAR_OPTIONS } from '../utils';
import { TagFieldData } from '../tags-selector/tag-field-data';
import { articleHasTag } from '../utils';
import {
  ConfirmationPromptComponent
} from '../confirmation-prompt/confirmation-prompt.component';

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
  tagsSub: Subscription;
  tags: TagFieldData[] = [];

  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private router: Router,
              private snackbar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.article.id = this.route.snapshot.queryParams['id'];

    if (this.article.id) {
      this.articleService.getArticle(this.article.id)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
          this._toggleTags(article);
        }, () => {
          this.snackbar.open('Error loading article', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
          this.article = null;
        });
    }

    this.tagsSub = this.articleService.getTags()
      .subscribe(tags => {
        this.tags = tags.map(tag => {
          return {
            id: tag.id,
            name: tag.name,
            selected: false
          };
        });

        this._toggleTags(this.article);
      });
  }

  ngOnDestroy() {
    this.tagsSub.unsubscribe();
  }

  _toggleTags(article: Article) {
    for (let tag of this.tags) {
      tag.selected = articleHasTag(article, tag.id);
    }
  }

  _setTagsOnArticle() {
    let toDelete = new Set();
    let toAdd = [];

    for (let tag of this.tags) {
      const hasTag = articleHasTag(this.article, tag.id);

      if (!tag.selected && hasTag) {
        toDelete.add(tag.id);
      }
      else if (tag.selected && !hasTag) {
        toAdd.push(tag.id);
      }
    }

    this.article.tags = this.article.tags.filter(tag => !toDelete.has(tag.id));

    for (let tag of toAdd) {
      this.article.tags.push({
        id: tag,
        name: '',
        articles: []
      });
    }
  }

  save() {
    this._setTagsOnArticle();

    if (this.article.id) {
      this.articleService.updateArticle(this.article)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
          this.snackbar.open('Article saved', 'Dismiss',
                             SUCCESS_SNACKBAR_OPTIONS);
        }, () => {
          this.snackbar.open('Error saving article', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        });
    }
    else {
      this.articleService.postArticle(this.article)
        .pipe(take(1))
        .subscribe(article => {
          this.article = article;
          this.snackbar.open('Article saved', 'Dismiss',
                             SUCCESS_SNACKBAR_OPTIONS);
          this.router.navigate(['/compose-article'], {
            queryParams: { id: article.id }
          });
        }, () => {
          this.snackbar.open('Error saving article', 'Dismiss',
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
        this.router.navigate(['/articles']);
      }
    });
  }

  delete() {
    const dialog = this.dialog.open(ConfirmationPromptComponent, {
      data: {
        message: 'Are you sure you want to delete this article?'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteArticle(this.article.id)
        .pipe(take(1))
        .subscribe(
          () => {
            this.snackbar.open('Article deleted', 'Dismiss',
                               SUCCESS_SNACKBAR_OPTIONS);
            this.router.navigate(['/articles']);
          }, () => {
            this.snackbar.open('Error deleting article', 'Dismiss',
                               ERROR_SNACKBAR_OPTIONS);
          }
        );
      }
    });
  }

  togglePublished() {
    let publish = this.article.draft;

    this.articleService.publishArticle(this.article.id, publish)
      .pipe(take(1))
      .subscribe(() => {
        this.article.draft = !publish;
        this.snackbar.open('Article published', 'Dismiss',
                           SUCCESS_SNACKBAR_OPTIONS);
      }, () => {
        this.snackbar.open('Error publishing article', 'Dismiss',
                           ERROR_SNACKBAR_OPTIONS);
      });
  }
}
