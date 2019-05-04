import { Injectable } from '@angular/core';
import { Mutation, Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendEmailGql extends Mutation {
  document = gql`
    mutation sendEmail($email: String!,
                       $subject: String!,
                       $message: String!,
                       $captcha: String!) {
      sendEmail(
        email: $email,
        subject: $subject,
        message: $message,
        captcha: $captcha
      )
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private apollo: Apollo,
              private sendEmailGql: SendEmailGql) { }

  sendEmail(email: string,
            subject: string,
            message: string,
            captcha: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: this.sendEmailGql.document,
      variables: {
        email,
        subject,
        message,
        captcha
      }
    });
  }
}
