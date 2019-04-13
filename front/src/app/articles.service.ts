import { Injectable } from '@angular/core';
import { Query, Mutation } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article, Comment } from './types'

interface GetArticleResponse {
  article: Article;
}

@Injectable({
  providedIn: "root"
})
class GetArticleGql extends Query<GetArticleResponse> {
  document = gql`
    query article($id: ID!) {
      article(id: $id) {
        id
        publishedAt
        title
        summary
        content
        tags
        comments {
          id
        }
      }
    }
  `;
}

interface GetArticlesResponse {
  publishedArticles: Article[];
}

@Injectable({
  providedIn: "root"
})
class GetPublishedArticlesGql extends Query<GetArticlesResponse> {
  document = gql`
    query {
      publishedArticles {
        id
        publishedAt
        title
        summary
        tags
        comments {
          id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: "root"
})
class GetCommentsGql extends Query<GetArticleResponse> {
  document = gql`
    query article($id: ID!) {
      article(id: $id) {
        id
        comments {
          id
          createdAt
          content
          user {
            id
            name
          }
        }
      }
    }
  `;
}

interface PostCommentResponse {
  comment: Comment
}

@Injectable({
  providedIn: 'root'
})
class PostCommentGql extends Mutation<PostCommentResponse> {
  document = gql`
    mutation postComment($articleId: ID!, $content: String!) {
      postComment(
        articleId: $articleId,
        content: $content
      ) {
        id
        createdAt
        content
        user {
          id
          name
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private getArticleGql: GetArticleGql,
              private getArticlesGql: GetPublishedArticlesGql,
              private postCommentGql: PostCommentGql,
              private getCommentsGql: GetCommentsGql) {}

  getArticle(id: string): Observable<Article> {
    return this.getArticleGql.watch({id: id})
      .valueChanges
      .pipe(
        map(result => result.data.article)
      );
  }

  getArticles(): Observable<Article[]> {
    return this.getArticlesGql.watch()
      .valueChanges
      .pipe(
        map(result => result.data.publishedArticles)
      );
  }

  getComments(articleId: string): Observable<Comment[]> {
    return this.getCommentsGql.watch({id: articleId})
      .valueChanges
      .pipe(
        map(result => result.data.article.comments)
      );
  }

  postComment(articleId: string, comment: string): Observable<Comment> {
    return this.postCommentGql.mutate({
      articleId: articleId,
      content: comment
    })
    .pipe(
      map(result => result.data.postComment)
    );
  }
}
