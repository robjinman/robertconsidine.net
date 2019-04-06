import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { QuillModule } from 'ngx-quill';
import { ApolloLink } from 'apollo-link';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { CommentsComponent } from './comments/comments.component';
import { ComposeComponent } from './compose/compose.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { LoggingComponent } from './logging/logging.component';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { LoginComponent } from './login/login.component';

const middleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  if (token) {
    operation.setContext({
      headers: new HttpHeaders().set("Authorization", `Bearer ${token}`)
    });
  }
  return forward(operation);
});

// The root module for this app
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ArticlesComponent,
    CommentsComponent,
    ComposeComponent,
    SubscribersComponent,
    LoggingComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularSplitModule.forRoot(),
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    QuillModule,
    MaterialUiModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      const http = httpLink.create({
        uri: "http://localhost:4000"
      });

      return {
        cache: new InMemoryCache(),
        link: middleware.concat(http)
      }
    },
    deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
