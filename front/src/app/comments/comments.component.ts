import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../types';
import { ArticleService } from '../articles.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.styl']
})
export class CommentsComponent implements OnInit {
  @Input() articleId: string;
  @Input() comments: Comment[];

  private comment: string;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
  }

  submit() {
    this.articleService.postComment(this.articleId, this.comment);
  }
}
