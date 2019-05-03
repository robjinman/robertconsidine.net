import { Injectable } from '@angular/core';
import { Query, Mutation, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Page } from './types'
import { LoggingService } from './logging.service';

export interface GetPageResponse {
  page: Page;
}

@Injectable({
  providedIn: 'root'
})
export class GetPageGql extends Query<GetPageResponse> {
  document = gql`
    query page($name: String!) {
      page(name: $name) {
        id
        name
        content
      }
    }
  `;
}

export interface GetPagesResponse {
  pages: Page[];
}

@Injectable({
  providedIn: 'root'
})
export class GetPagesGql extends Query<GetPagesResponse> {
  document = gql`
    query {
      pages {
        id
        name
        content
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdatePageGql extends Mutation {
  document = gql`
    mutation updatePage($name: String!,
                        $content: String!) {
      updatePage(
        name: $name
        content: $content
      ) {
        id
        name
        content
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class PostPageGql extends Mutation {
  document = gql`
    mutation postPage($name: String!,
                      $content: String!) {
      postPage(
        name: $name
        content: $content
      ) {
        id
        name
        content
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeletePageGql extends Mutation {
  document = gql`
    mutation deletePage($name: String!) {
      deletePage(
        name: $name
      ) {
        id
        name
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor(private apollo: Apollo,
              private logger: LoggingService,
              private getPageGql: GetPageGql,
              private getPagesGql: GetPagesGql,
              private postPageGql: PostPageGql,
              private updatePageGql: UpdatePageGql,
              private deletePageGql: DeletePageGql) {}

  getPage(name: string): Observable<Page> {
    return this.getPageGql.watch({name: name})
      .valueChanges
      .pipe(
        map(result => result.data.page),
        tap(() => {
          this.logger.add(`Fetched ${name} page`);
        }, () => {
          this.logger.add(`Failed to fetch ${name} page`);
        })
      );
  }

  getPages(): Observable<Page[]> {
    return this.getPagesGql.watch()
      .valueChanges
      .pipe(
        map(result => result.data.pages),
        tap(() => {
          this.logger.add('Fetched pages');
        }, () => {
          this.logger.add('Failed to fetch pages');
        })
      );
  }

  postPage(page: Page): Observable<Page> {
    return this.apollo.mutate({
      mutation: this.postPageGql.document,
      variables: {
        name: page.name,
        content: page.content
      },
      refetchQueries: [{
        query: this.getPagesGql.document
      }]
    })
    .pipe(
      map(result => result.data.postPage),
      tap(() => {
        this.logger.add(`Created ${page.name} page`);
      }, () => {
        this.logger.add(`Failed to create ${page.name} page`);
      })
    );
  }

  updatePage(page: Page): Observable<Page> {
    return this.updatePageGql.mutate({
      name: page.name,
      content: page.content
    })
    .pipe(
      map(result => result.data.updatePage),
      tap(() => {
        this.logger.add(`Saved ${page.name} page`);
      }, () => {
        this.logger.add(`Failed to save ${page.name} page`);
      })
    );
  }

  deletePage(name: string): Observable<Page> {
    return this.apollo.mutate({
      mutation: this.deletePageGql.document,
      variables: { name },
      refetchQueries: [{
        query: this.getPagesGql.document
      }]
    })
    .pipe(
      map(result => result.data.deletePage),
      tap(() => {
        this.logger.add(`Deleted ${name} page`);
      }, () => {
        this.logger.add(`Failed to delete ${name} page`);
      })
    );
  }
}
