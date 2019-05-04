import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Mutation } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';
import { ApolloLink } from 'apollo-link';

import { LoggingService } from './logging.service';
import { AuthPayload } from './types';

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

@Injectable({
  providedIn: 'root'
})
export class AdminLoginGql extends Mutation {
  document = gql`
      mutation adminLogin($email: String!,
                          $password: String!,
                          $captcha: String!) {
        adminLogin(email: $email, password: $password, captcha: $captcha) {
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
  get userName(): string {
    return this.identityService.userName;
  }

  get token(): string {
    return this.identityService.token;
  }

  constructor(private logger: LoggingService,
              private identityService: IdentityService,
              private adminLoginGql: AdminLoginGql) {}

  adminLogin(email: string,
        password: string,
        captcha: string): Observable<AuthPayload> {
    return this.adminLoginGql.mutate({ email, password, captcha })
      .pipe(
        map(result => result.data.adminLogin),
        tap(auth => {
          this.identityService.userName = auth.user.name;
          this.identityService.token = auth.token;
    
          this.logger.add('Logged in');
        }, () => {
          this.logger.add('Login failed');
        })
      );
  }

  logout() {
    this.identityService.userName = null;
    this.identityService.token = null;

    this.logger.add('Logged out');
  }

  authorised(): boolean {
    return this.token != null && this.token.length > 0;
  }
}
