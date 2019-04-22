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
  constructor(authService: AuthService) {
    const handler = (operation: any, forward: any) => {
      const token = authService.token;
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
  providedIn: 'root'
})
export class AuthService {
  userName: string = null;
  token: string = null;

  constructor(private logger: LoggingService, private loginGql: LoginGql) {
    this.userName = localStorage.getItem('userName');
    this.token = localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<AuthPayload> {
    return this.loginGql.mutate({ email, password })
      .pipe(
        map(result => result.data.login),
        tap(auth => {
          this.userName = auth.user.name;
          this.token = auth.token;
    
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('token', this.token);
    
          this.logger.add('Logged in');
        }, () => {
          this.logger.add('Login failed');
        })
      );
  }

  logout() {
    this.userName = null;
    this.token = null;
    localStorage.removeItem('userName');
    localStorage.removeItem('token');

    this.logger.add('Logged out');
  }

  authorised(): boolean {
    return this.token != null && this.token.length > 0;
  }
}
