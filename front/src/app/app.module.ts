import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { ArticleComponent } from './article/article.component';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService,
         LoginGql,
         SignupGql,
         AuthMiddleware } from './auth.service';
import { HeaderComponent } from './header/header.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    ArticleComponent,
    CommentsComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    PortfolioComponent,
    AboutComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    MaterialUiModule
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: (loginGql: LoginGql, signupGql: SignupGql) => {
        return new AuthService(loginGql, signupGql);
      },
      deps: [LoginGql, SignupGql]
    },
    {
      provide: AuthMiddleware,
      useFactory: (authService: AuthService) => new AuthMiddleware(authService),
      deps: [AuthService]
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authMiddleware: AuthMiddleware) => {
        const http = httpLink.create({
          uri: "http://localhost:4000"
        });

        return {
          cache: new InMemoryCache(),
          link: authMiddleware.concat(http)
        }
      },
      deps: [HttpLink, AuthMiddleware]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
