import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ArticleService } from '../article.service';

export interface ArticleTableRow {
  id: string,
  published: string;
  lastModified: string;
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
    "published",
    "lastModified",
    "title",
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
            published: article.createdAt,
            lastModified: article.createdAt,
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
