import { Injectable } from '@angular/core';
import { Query, Mutation } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article } from './types'
import { LoggingService } from './logging.service';

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
  `;
}

interface GetArticlesResponse {
  articles: Article[];
}

@Injectable({
  providedIn: "root"
})
class GetArticlesGql extends Query<GetArticlesResponse> {
  document = gql`
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
  `;
}

@Injectable({
  providedIn: "root"
})
class UpdateArticleGql extends Mutation {
  document = gql`
    mutation updateArticle($id: ID!,
                    $title: String!,
                    $summary: String!,
                    $content: String!,
                    $tags: [String!]!) {
      updateArticle(
        id: $id
        title: $title
        summary: $summary
        content: $content
        tags: $tags
      ) {
        id
        title
        summary
        content
        tags
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private logger: LoggingService,
              private getArticleGql: GetArticleGql,
              private getArticlesGql: GetArticlesGql,
              private updateArticleGql: UpdateArticleGql) {}

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
        map(result => result.data.articles)
      );
  }

  updateArticle(article: Article): Observable<Article> {
    this.logger.add(`Saving article, id=${article.id}`);

    return this.updateArticleGql.mutate({
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      tags: article.tags
    })
    .pipe(
      map(result => result.data.updateArticle)
    );
  }
}
