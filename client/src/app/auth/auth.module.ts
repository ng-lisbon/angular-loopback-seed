import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { authRouting } from './auth.routing';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { PasswordResetConfirmComponent } from './password-reset/password-reset-confirm.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
    ConfirmEmailComponent,
    PasswordResetConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    authRouting,
    SharedModule
  ]
})
export class AuthModule {}
