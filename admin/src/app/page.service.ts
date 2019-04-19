import { Injectable } from '@angular/core';
import { Query, Mutation, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Page } from './types'
import { LoggingService } from './logging.service';

interface GetPageResponse {
  page: Page;
}

@Injectable({
  providedIn: 'root'
})
class GetPageGql extends Query<GetPageResponse> {
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

interface GetPagesResponse {
  pages: Page[];
}

@Injectable({
  providedIn: 'root'
})
class GetPagesGql extends Query<GetPagesResponse> {
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
class UpdatePageGql extends Mutation {
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
class PostPageGql extends Mutation {
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
class DeletePageGql extends Mutation {
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
    this.logger.add(`Fetching page, name=${name}`);

    return this.getPageGql.watch({name: name})
      .valueChanges
      .pipe(
        map(result => result.data.page)
      );
  }

  getPages(): Observable<Page[]> {
    this.logger.add('Fetching all pages');

    return this.getPagesGql.watch()
      .valueChanges
      .pipe(
        map(result => result.data.pages)
      );
  }

  postPage(page: Page): Observable<Page> {
    this.logger.add('Creating page');

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
      map(result => result.data.postPage)
    );
  }

  updatePage(page: Page): Observable<Page> {
    this.logger.add(`Saving page, name=${page.name}`);

    return this.updatePageGql.mutate({
      name: page.name,
      content: page.content
    })
    .pipe(
      map(result => result.data.updatePage)
    );
  }

  deletePage(name: string): Observable<Page> {
    this.logger.add(`Deleting page, name=${name}`);

    return this.apollo.mutate({
      mutation: this.deletePageGql.document,
      variables: { name },
      refetchQueries: [{
        query: this.getPagesGql.document
      }]
    })
    .pipe(
      map(result => result.data.deletePage)
    );
  }
}
