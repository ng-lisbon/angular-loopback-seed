import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../shared/account.service';
import { AlertsService} from '../shared/alerts/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  alerts = [];

  constructor(private accountService: AccountService, private router: Router,
    private alertsService: AlertsService) { }
  
  onSubmit(loginForm: NgForm) {
    this.accountService.loginUser(loginForm.value.email, loginForm.value.password)
    .subscribe(
      (auth) => {
        this.router.navigate(['/profile'])
      },
      (error) => {
        this.alertsService.addAlert({
          type: 'danger',
          message: 'Could not log in. Please check e-mail and password.'
        }, true);
      }
    );
  }

  ngOnInit() {
  }

}
