import { Injectable } from '@angular/core';
import { Query, Apollo, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from './types';
import { LoggingService } from './logging.service';

export interface GetUsersResponse {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class GetUsersGql extends Query<GetUsersResponse> {
  document = gql`
    query {
      users {
        id
        createdAt
        name
        email
        activated
      }
    }
  `;
}

export interface GetUserResponse {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class GetUserGql extends Query<GetUserResponse> {
  document = gql`
    query user($name: String!) {
      user(name: $name) {
        id
        name
        activated
        email
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateUserGql extends Mutation {
  document = gql`
    mutation updateUser($currentPw: String!,
                        $id: ID!,
                        $name: String!,
                        $email: String!,
                        $newPw: String!) {
      updateUser(currentPw: $currentPw,
                 id: $id,
                 name: $name,
                 email: $email,
                 newPw: $newPw) {
        id
        name
        email
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteUserGql extends Mutation {
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
              private getUserGql: GetUserGql,
              private getUsersGql: GetUsersGql,
              private updateUserGql: UpdateUserGql,
              private deleteUserGql: DeleteUserGql) { }

  getUser(name: string): Observable<User> {
    return this.getUserGql.watch({ name })
      .valueChanges
      .pipe(
        map(result => result.data.user),
        tap(() => {
          this.logger.add(`Fetched user, name=${name}`);
        }, () => {
          this.logger.add('Failed to fetch user');
        })
      );
  }

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

  updateUser(currentPw: string,
             id: string,
             name: string,
             email: string,
             newPw: string): Observable<User> {

    return this.apollo.mutate({
      mutation: this.updateUserGql.document,
      variables: { currentPw, id, name, email, newPw },
      refetchQueries: [{
        query: this.getUserGql.document,
        variables: {
          name: name
        }
      }]
    })
    .pipe(
      map(result => result.data.updateUser),
      tap(() => {
        this.logger.add(`Updated user, id=${id}`);
      }, () => {
        this.logger.add(`Failed to update user, id=${id}`);
      })
    );
  }
}
