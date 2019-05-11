import { Injectable } from '@angular/core';
import { Query, Mutation, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article, Comment } from './types'

export interface GetArticleResponse {
  article: Article;
}

@Injectable({
  providedIn: "root"
})
export class GetArticleGql extends Query<GetArticleResponse> {
  document = gql`
    query article($id: ID!) {
      article(id: $id) {
        id
        publishedAt
        title
        summary
        content
        tags {
          id
          name
        }
        comments {
          id
        }
      }
    }
  `;
}

export interface GetArticlesResponse {
  publishedArticles: Article[];
}

@Injectable({
  providedIn: "root"
})
export class GetPublishedArticlesGql extends Query<GetArticlesResponse> {
  document = gql`
    query {
      publishedArticles {
        id
        publishedAt
        title
        summary
        tags {
          id
          name
        }
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
export class GetCommentsGql extends Query<GetArticleResponse> {
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
            activated
          }
        }
      }
    }
  `;
}

export interface PostCommentResponse {
  comment: Comment
}

@Injectable({
  providedIn: 'root'
})
export class PostCommentGql extends Mutation<PostCommentResponse> {
  document = gql`
    mutation postComment($articleId: ID!,
                         $content: String!,
                         $captcha: String!) {
      postComment(
        articleId: $articleId,
        content: $content,
        captcha: $captcha
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
  constructor(private apollo: Apollo,
              private getArticleGql: GetArticleGql,
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

  postComment(articleId: string,
              comment: string,
              captcha: string): Observable<Comment> {
    return this.apollo.mutate({
      mutation: this.postCommentGql.document,
      variables: {
        articleId: articleId,
        content: comment,
        captcha: captcha
      },
      refetchQueries: [{
        query: this.getCommentsGql.document,
        variables: {
          id: articleId
        }
      }]
    })
    .pipe(
      map(result => result.data.postComment)
    );
  }
}
