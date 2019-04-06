import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

@Injectable({
  providedIn: "root"
})
class LoginGql extends Mutation {
  document = gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private loginGql: LoginGql) {}

  userName: string = null;
  token: string = null;

  login(email: string, password: string): Observable<string> {
    let ob = this.loginGql.mutate({ email, password })
      .pipe(
        map(result => result.data.login)
      );

    ob.subscribe(auth => {
      this.userName = auth.userName;
      this.token = auth.token;
    });

    return ob;
  }

  authorised(): boolean {
    return this.token != null && this.token.length > 0;
  }
}
