import { Component, OnInit } from '@angular/core';

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
    this.articlesService.getArticles().subscribe(articles => {
      this.articleTable = articles.map(article => {
        return {
          id: article.id,
          published: article.createdAt,
          lastModified: article.createdAt,
          title: article.title,
          draft: false,
          comments: article.comments.length
        };
      })
    });
  }

}
