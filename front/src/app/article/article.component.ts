import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ArticleService } from '../articles.service';
import { Article } from '../types';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.styl']
})
export class ArticleComponent implements OnInit {
  article: Article = null;

  constructor(private route: ActivatedRoute,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => this.articleService.getArticle(params.get('id')))
    )
    .subscribe(article => this.article = article);
  }
}
