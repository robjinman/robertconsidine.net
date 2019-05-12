import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AuthMiddleware, IdentityService} from './auth.service';
import { HeaderComponent } from './header/header.component';
import { PageComponent } from './page/page.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { CaptchaComponent } from './captcha/captcha.component';
import { environment } from 'src/environments/environment';
import { ContactComponent } from './contact/contact.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    ArticleComponent,
    CommentsComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    PageComponent,
    CaptchaComponent,
    ContactComponent,
    TagsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
      provide: AuthMiddleware,
      useFactory: (identityService: IdentityService) => {
        return new AuthMiddleware(identityService);
      },
      deps: [IdentityService]
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authMiddleware: AuthMiddleware) => {
        const http = httpLink.create({
          uri: environment.apiServerUri
        });

        return {
          cache: new InMemoryCache(),
          link: authMiddleware.concat(http)
        }
      },
      deps: [HttpLink, AuthMiddleware]
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 2000,
        panelClass: ['snackbar']
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
