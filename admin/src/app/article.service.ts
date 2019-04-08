import { Injectable } from '@angular/core';
import { Query, Mutation, Apollo } from 'apollo-angular';
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
        draft
        createdAt
        modifiedAt
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
  allArticles: Article[];
}

@Injectable({
  providedIn: "root"
})
class GetAllArticlesGql extends Query<GetArticlesResponse> {
  document = gql`
    query {
      allArticles {
        id
        draft
        createdAt
        modifiedAt
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
        draft
        modifiedAt
        title
        summary
        content
        tags
      }
    }
  `;
}

@Injectable({
  providedIn: "root"
})
class PostArticleGql extends Mutation {
  document = gql`
    mutation postArticle($title: String!,
                         $summary: String!,
                         $content: String!,
                         $tags: [String!]!) {
      postArticle(
        title: $title
        summary: $summary
        content: $content
        tags: $tags
      ) {
        id
        draft
        modifiedAt
        title
        summary
        content
        tags
      }
    }
  `;
}

@Injectable({
  providedIn: "root"
})
class PublishArticleGql extends Mutation {
  document = gql`
    mutation publishArticle($id: ID!,
                            $publish: Boolean!) {
      publishArticle(
        id: $id
        publish: $publish
      ) {
        id
        draft
        publishedAt
      }
    }
  `;
}

@Injectable({
  providedIn: "root"
})
class DeleteArticleGql extends Mutation {
  document = gql`
    mutation deleteArticle($id: ID!) {
      deleteArticle(
        id: $id
      ) {
        id
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private apollo: Apollo,
              private logger: LoggingService,
              private getArticleGql: GetArticleGql,
              private getArticlesGql: GetAllArticlesGql,
              private postArticleGql: PostArticleGql,
              private updateArticleGql: UpdateArticleGql,
              private publishArticleGql: PublishArticleGql,
              private deleteArticleGql: DeleteArticleGql) {}

  getArticle(id: string): Observable<Article> {
    this.logger.add(`Fetching article, id=${id}`);

    return this.getArticleGql.watch({id: id})
      .valueChanges
      .pipe(
        map(result => result.data.article)
      );
  }

  getArticles(): Observable<Article[]> {
    this.logger.add("Fetching all articles");

    return this.getArticlesGql.watch()
      .valueChanges
      .pipe(
        map(result => result.data.allArticles)
      );
  }

  postArticle(article: Article): Observable<Article> {
    this.logger.add("Creating article");

    return this.apollo.mutate({
      mutation: this.postArticleGql.document,
      variables: {
        title: article.title,
        summary: article.summary,
        content: article.content,
        tags: article.tags
      },
      refetchQueries: [{
        query: this.getArticlesGql.document
      }]
    })
    .pipe(
      map(result => result.data.postArticle)
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

  publishArticle(id: string, publish: boolean): Observable<Article> {
    if (publish) {
      this.logger.add(`Publishing article, id=${id}`);
    }
    else {
      this.logger.add(`Unpublishing article, id=${id}`);
    }

    return this.publishArticleGql.mutate({
      id,
      publish
    })
    .pipe(
      map(result => result.data.publishArticle)
    );
  }

  deleteArticle(id: string): Observable<Article> {
    this.logger.add(`Deleting article, id=${id}`);

    return this.deleteArticleGql.mutate({
      id
    })
    .pipe(
      map(result => result.data.deleteArticle)
    );
  }
}
