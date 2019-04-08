import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ArticleService } from '../articles.service';
import { Article } from '../types';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.styl']
})
export class FeedComponent implements OnInit {
  articles: Observable<Article[]>;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articles = this.articleService.getArticles();
  }

}
