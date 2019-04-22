import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Mutation } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';
import { ApolloLink } from 'apollo-link';

import { AuthPayload } from './types';

@Injectable({
  providedIn: "root"
})
export class AuthMiddleware extends ApolloLink {
  constructor(authService: AuthService) {
    const handler = (operation: any, forward: any) => {
      const token = authService.token;

      if (token) {
        operation.setContext({
          headers: new HttpHeaders().set("Authorization", `Bearer ${token}`)
        });
      }
      return forward(operation);
    };

    super(handler);
  }
}

@Injectable({
  providedIn: "root"
})
export class LoginGql extends Mutation {
  document = gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token,
          user {
            name
          }
        }
      }
  `;
}

@Injectable({
  providedIn: "root"
})
export class SignupGql extends Mutation {
  document = gql`
      mutation signup($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
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
export class AuthService {
  private _userName: string = null;
  private _token: string = null;

  get userName(): string {
    return this._userName;
  }

  get token(): string {
    return this._token;
  }

  constructor(private loginGql: LoginGql,
              private signupGql: SignupGql) {
    this._userName = localStorage.getItem("userName");
    this._token = localStorage.getItem("token");
  }

  login(email: string, password: string): Observable<AuthPayload> {
    return this.loginGql.mutate({ email, password })
      .pipe(
        map(result => result.data.login),
        tap(auth => {
          this._userName = auth.user.name;
          this._token = auth.token;
    
          localStorage.setItem("userName", this._userName);
          localStorage.setItem("token", this._token);
        })
      );
  }

  signup(email: string,
         password: string,
         name: string): Observable<AuthPayload> {
    return this.signupGql.mutate({ email, password, name })
      .pipe(
        map(result => result.data.signup),
        tap(auth => {
          this._userName = auth.user.name;
          this._token = auth.token;
    
          localStorage.setItem("userName", this._userName);
          localStorage.setItem("token", this._token);
        })
      );
  }

  logout() {
    this._userName = null;
    this._token = null;
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
  }

  authorised(): boolean {
    return this._token != null && this._token.length > 0;
  }
}
