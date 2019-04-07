import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ArticleService } from '../article.service';

export interface ArticleTableRow {
  id: string,
  createdAt: string;
  modifiedAt: string;
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
    "title",
    "createdAt",
    "modifiedAt",
    "publishedAt",
    "draft",
    "comments"
  ];

  constructor(private articlesService: ArticleService) { }

  ngOnInit() {
    this.articlesService.getArticles()
      .pipe(
        take(1),
        map(articles => articles.map(article => {
          return {
            id: article.id,
            createdAt: article.createdAt,
            modifiedAt: article.modifiedAt,
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

}
