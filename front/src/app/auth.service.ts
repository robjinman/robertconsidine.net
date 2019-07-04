import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Mutation, Query, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import gql from 'graphql-tag';
import { ApolloLink } from 'apollo-link';

import { AuthPayload, User } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthMiddleware extends ApolloLink {
  constructor(identityService: IdentityService) {
    const handler = (operation: any, forward: any) => {
      const token = identityService.token;

      if (token) {
        operation.setContext({
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        });
      }
      return forward(operation);
    };

    super(handler);
  }
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
        name,
        activated
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class LoginGql extends Mutation {
  document = gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token,
          user {
            name,
            activated
          }
        }
      }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class SignupGql extends Mutation {
  document = gql`
      mutation signup($email: String!,
                      $password: String!,
                      $name: String!,
                      $captcha: String!) {
        signup(email: $email,
               password: $password,
               name: $name,
               captcha: $captcha) {
          token,
          user {
            name
          }
        }
      }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ActivateAccountGql extends Mutation {
  document = gql`
    mutation activateAccount($id: ID!, $code: String!) {
      activateAccount(id: $id, code: $code)
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private _token: string = null;
  private _userName: string = null;

  constructor() {
    this._userName = localStorage.getItem('userName');
    this._token = localStorage.getItem('token');
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
    if (this._userName) {
      localStorage.setItem('userName', this._userName);
    }
    else {
      localStorage.removeItem('userName');
    }
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
    if (this._token) {
      localStorage.setItem('token', this._token);
    }
    else {
      localStorage.removeItem('token');
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userActivated: boolean = false;

  constructor(private apollo: Apollo,
              private identityService: IdentityService,
              private loginGql: LoginGql,
              private signupGql: SignupGql,
              private activateAccountGql: ActivateAccountGql,
              private getUserGql: GetUserGql) {

    if (this.authorised) {
      this.getUser(this.userName)
        .pipe(take(1))
        .subscribe(user => {
          this._userActivated = user.activated;
        });
    }
  }

  get userName(): string {
    return this.identityService.userName;
  }

  get token(): string {
    return this.identityService.token;
  }

  get authorised(): boolean {
    return this.token != null && this.token.length > 0;
  }

  get activated(): boolean {
    return this._userActivated;
  }

  getUser(name: string): Observable<User> {
    return this.getUserGql.watch({ name })
      .valueChanges
      .pipe(
        map(result => result.data.user)
      );
  }

  login(email: string, password: string): Observable<AuthPayload> {
    return this.loginGql.mutate({ email, password })
      .pipe(
        map(result => result.data.login),
        tap(auth => {
          this.identityService.userName = auth.user.name;
          this.identityService.token = auth.token;
        })
      );
  }

  signup(email: string,
         password: string,
         name: string,
         captcha: string): Observable<AuthPayload> {
    return this.signupGql.mutate({ email, password, name, captcha })
      .pipe(
        map(result => result.data.signup),
        tap(auth => {
          this.identityService.userName = auth.user.name;
          this.identityService.token = auth.token;
        })
      );
  }

  activateAccount(id: string, code: string) {
    return this.apollo.mutate({
      mutation: this.activateAccountGql.document,
      variables: {
        id,
        code
      },
      refetchQueries: [{
        query: this.getUserGql.document,
        variables: {
          id
        }
      }]
    }).pipe(tap(() => {
      this._userActivated = true;
    }));
  }

  logout() {
    this.identityService.userName = null;
    this.identityService.token = null;
  }
}
