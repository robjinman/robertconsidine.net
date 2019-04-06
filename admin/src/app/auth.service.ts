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
  userName: string = null;
  token: string = null;

  constructor(private loginGql: LoginGql) {
    this.userName = localStorage.getItem("userName");
    this.token = localStorage.getItem("token");
  }

  login(email: string, password: string): Observable<string> {
    let ob = this.loginGql.mutate({ email, password })
      .pipe(
        map(result => result.data.login)
      );

    ob.subscribe(auth => {
      this.userName = auth.userName;
      this.token = auth.token;

      localStorage.setItem("userName", this.userName);
      localStorage.setItem("token", this.token);
    });

    return ob;
  }

  authorised(): boolean {
    return this.token != null && this.token.length > 0;
  }
}
