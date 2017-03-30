import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { AlertsService } from '../shared/alerts/alerts.service';
import { Account } from '../shared/sdk/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  wasRegistered = false;

  constructor(private authService: AuthService, private router: Router,
    private alertsService: AlertsService) { }

  onSubmit(registerForm: NgForm) {
    const account = new Account();
    account.email = registerForm.value.email;
    account.password = registerForm.value.password;
    account.firstname = registerForm.value.firstname;
    account.lastname = registerForm.value.lastname;
    this.authService.registerUser(account)
    .subscribe(
      (auth) => {
        this.wasRegistered = true
      },
      (error) => {
        console.log(error);
        let message = 'Could not register. Please check if your email address is valid and if your password contains at least 6 characters.';
        if (error.details.codes.email.indexOf('uniqueness') > -1) {
          message = 'We found that email address in our database. Did you register already?'
        }
        this.alertsService.addAlert({
          type: 'danger',
          message: message
        }, true);
      }
    );
  }

  ngOnInit() {
  }

}
