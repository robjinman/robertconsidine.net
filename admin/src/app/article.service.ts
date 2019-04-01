import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article, Query } from './types'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private apollo: Apollo) {}

  getArticle(id: String): Observable<Article> {
    return this.apollo.query<Query>({
      query: gql`
        query {
          article(id: "${id}") {
            id
            createdAt
            title
            summary
            content
            tags
            comments {
              id
            }
          }
        }
      `
    })
    .pipe(
      map(result => result.data.article)
    );
  }

  getArticles(): Observable<Article[]> {
    return this.apollo.watchQuery<Query>({
      query: gql`
        query {
          articles {
            id
            createdAt
            title
            summary
            tags
            comments {
              id
            }
          }
        }
      `
    })
    .valueChanges
    .pipe(
      map(result => result.data.articles)
    )
  }
}
