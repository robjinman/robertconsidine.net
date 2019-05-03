import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Page } from './types'

export interface GetPageResponse {
  page: Page;
}

@Injectable({
  providedIn: "root"
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

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor(private getPageGql: GetPageGql) {}

  getPage(name: string): Observable<Page> {
    return this.getPageGql.watch({name: name})
      .valueChanges
      .pipe(
        map(result => result.data.page)
      );
  }
}
