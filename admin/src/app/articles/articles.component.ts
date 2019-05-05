import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { ArticleService } from '../article.service';

export interface ArticleTableRow {
  id: string;
  createdAt: string;
  publishedAt: string;
  title: string;
  draft: boolean;
  comments: number;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.styl']
})
export class ArticlesComponent implements OnInit {
  articleTable: ArticleTableRow[] = [];
  displayedColumns: string[] = [
    'title',
    'createdAt',
    'publishedAt',
    'draft',
    'comments'
  ];

  constructor(private router: Router,
              private articlesService: ArticleService) { }

  ngOnInit() {
    this.articlesService.getArticles()
      .pipe(
        take(1),
        map(articles => articles.map(article => {
          return {
            id: article.id,
            createdAt: article.createdAt,
            publishedAt: article.publishedAt,
            title: article.title,
            draft: article.draft,
            comments: article.comments.length
          };
        }))
      )
      .subscribe(articleTable => {
        this.articleTable = articleTable;
      });
  }

  newArticle() {
    this.router.navigate(['/compose-article']);
  }
}
