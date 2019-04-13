import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Comment } from '../types';
import { ArticleService } from '../articles.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.styl']
})
export class CommentsComponent implements OnInit {
  @Input() articleId: string;
  comments: Observable<Comment[]>;
  comment: string = "";
  errMsg: string = "";

  constructor(private authService: AuthService,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.comments = this.articleService.getComments(this.articleId);
  }

  authorised(): boolean {
    return this.authService.authorised();
  }

  submit() {
    this.articleService.postComment(this.articleId, this.comment)
      .subscribe(
        () => {},
        err => {
          console.log(err);
          this.errMsg = "Error posting comment";
        })
  }
}
