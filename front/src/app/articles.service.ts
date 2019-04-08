import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article } from './types'

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
  providedIn: 'root'
})
export class ArticleService {
  constructor(private getArticleGql: GetArticleGql,
              private getArticlesGql: GetPublishedArticlesGql) {}

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
}
