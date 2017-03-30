import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HeaderComponent } from './shared/header.component';
import { AccountService } from './shared/account.service';
import { AuthGuard } from './shared/auth.guard';
import { NotAuthGuard } from './shared/notauth.guard';
import { HomeComponent } from './home.component';
import { AlertsService } from './shared/alerts/alerts.service';
import { AlertsComponent } from './shared/alerts/alerts.component';
import { SDKBrowserModule } from './shared/sdk/index';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlertsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    routing,
    SDKBrowserModule.forRoot()
  ],
  providers: [
    AccountService,
    AuthGuard,
    NotAuthGuard,
    AlertsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
