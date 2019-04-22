import { Injectable } from '@angular/core';
import { Query, Apollo, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from './types';
import { LoggingService } from './logging.service';

interface GetUsersResponse {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
class GetUsersGql extends Query<GetUsersResponse> {
  document = gql`
    query {
      users {
        id
        createdAt
        name
        email
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
class DeleteUserGql extends Mutation {
  document = gql`
    mutation deleteUser($id: ID!) {
      deleteUser(id: $id) {
        id
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo,
              private logger: LoggingService,
              private getUsersGql: GetUsersGql,
              private deleteUserGql: DeleteUserGql) { }

  getUsers(): Observable<User[]> {
    return this.getUsersGql.watch()
      .valueChanges
      .pipe(
        map(result => result.data.users),
        tap(() => {
          this.logger.add('Fetched users');
        }, () => {
          this.logger.add('Failed to fetch users');
        })
      );
  }

  deleteUser(id: string): Observable<User> {
    return this.apollo.mutate({
      mutation: this.deleteUserGql.document,
      variables: { id },
      refetchQueries: [{
        query: this.getUsersGql.document
      }]
    })
    .pipe(
      map(result => result.data.deleteUser),
      tap(() => {
        this.logger.add(`Deleted user, id=${id}`);
      }, () => {
        this.logger.add(`Failed to delete user, id=${id}`);
      })
    );
  }
}
