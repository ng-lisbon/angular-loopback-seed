import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AccountService } from '../shared/account.service';
import { AlertsService } from '../shared/alerts/alerts.service';

@Component({
  selector: 'app-tester',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  userEmail = '';
  alerts = [];

  constructor(private accountService: AccountService,
    private alertsService: AlertsService) { }

  onChangeMail(form: NgForm) {
    this.accountService.setMailAddress(form.value.email, form.value.password)
    .subscribe(
      () => {
        this.userEmail = form.value.email;
        form.reset();
        this.alertsService.addAlert({
          type: 'success',
          message: 'Your e-mail address was changed successfully.'
        }, true);
      },
      (error) => {
        let message = 'Please check if your new e-mail address is valid.';
        if (error.message == 'WrongPassword') {
          message = 'Please check your password.'
        }
        this.alertsService.addAlert({
          type: 'danger',
          message: 'Could not change e-mail address. ' + message
        }, true);
      }
    );
  }

  onChangePassword(form: NgForm) {
    this.accountService.setPassword(form.value.oldPassword, form.value.password)
    .subscribe(
      () => {
        form.reset()
        this.alertsService.addAlert({
          type: 'success',
          message: 'Your password was changed successfully.'
        }, true);
      },
      (error) => {
        let message = 'Please check that your new password contains at least 6 characters.';
        if (error.code == 'auth/wrong-password') {
          message = 'Please check your old password.'
        }
        this.alertsService.addAlert({
          type: 'danger',
          message: 'Could not change password. ' + message
        }, true);
      }
    );
  }

  ngOnInit() {
    this.userEmail = this.accountService.getMailAddress();
  }

}
