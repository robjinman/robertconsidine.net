import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../types'
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.styl']
})
export class ArticlesComponent implements OnInit {
  articles: Observable<Article[]>;

  constructor(private articlesService: ArticleService) { }

  ngOnInit() {
    this.articles = this.articlesService.getArticles();
  }

}
