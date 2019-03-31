import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Article, Query } from '../types'

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.styl']
})
export class ArticlesComponent implements OnInit {
  articles: Observable<Article[]>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.articles = this.apollo.watchQuery<Query>({
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
