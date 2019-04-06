import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Article } from '../types';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.styl']
})
export class ComposeComponent implements OnInit {
  article: Article;

  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    let id = this.route.snapshot.queryParams["id"];
    this.articleService.getArticle(id).subscribe(article => {
      this.article = article;
    });
  }

  save() {
    this.articleService.updateArticle(this.article).subscribe(article => {
      this.article = article;
    });
  }

  cancel() {
    this.router.navigate(["/articles"]);
  }
}
