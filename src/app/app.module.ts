import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TenantListComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
