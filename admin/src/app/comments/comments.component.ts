import { Component, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { ArticleService } from '../article.service';
import {
  ConfirmationPromptComponent
} from '../confirmation-prompt/confirmation-prompt.component';

const MAX_PREVIEW_LEN = 50;

export interface CommentTableRow {
  id: string;
  createdAt: string;
  userName: string;
  articleId: string;
  articleTitle: string;
  preview: string;
  content: string;
  showMore: boolean;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.styl']
})
export class CommentsComponent implements OnInit {
  tableData: CommentTableRow[] = [];
  tableData$: Subject<CommentTableRow[]> = new Subject<CommentTableRow[]>();
  columns: string[] = [
    'createdAt',
    'articleTitle',
    'userName',
    'content',
    'action'
  ];
  sub: Subscription;
  showDetails = (idx: number, row: CommentTableRow) => row.showMore;
  hideDetails = (idx: number, row: CommentTableRow) => !row.showMore;

  constructor(private articleService: ArticleService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.sub = this.articleService.getComments()
      .pipe(
        map(comments => comments.map(comment => {
          const preview = comment.content.slice(0, MAX_PREVIEW_LEN);
          const dots = comment.content.length > MAX_PREVIEW_LEN ? '...' : '';

          return {
            id: comment.id,
            createdAt: comment.createdAt,
            articleId: comment.article.id,
            articleTitle: comment.article.title,
            userName: comment.user ? comment.user.name : "[deleted]",
            preview: preview + dots,
            content: comment.content,
            showMore: false
          };
        }))
      )
      .subscribe(data => {
        this.tableData = data;
        this.tableData$.next(this.tableData);
      });
  }

  clickRow(row: CommentTableRow) {
    row.showMore = !row.showMore;
    this.tableData$.next(this.tableData);
  }

  deleteComment(id: string) {
    const dialog = this.dialog.open(ConfirmationPromptComponent, {
      data: {
        message: "Are you sure you want to delete the comment?"
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteComment(id).pipe(take(1)).subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
