import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AlertsService } from '../../shared/alerts/alerts.service';
import { AccountService } from '../../shared/account.service';

@Component({
  selector: 'app-password-reset-confirm',
  templateUrl: './password-reset-confirm.component.html',
  styles: []
})
export class PasswordResetConfirmComponent implements OnInit {
  wasError = false;

  constructor(private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private accountService: AccountService) { }

  onSubmit(form: NgForm) {
      this.accountService.resetPassword(form.value.password)
      .subscribe(
        () => {
          form.reset();
          this.alertsService.addAlert({
            type: 'success',
            message: 'Your password was set successfully. You can try to login now.'
          }, true);          
        },
        (error) => {
          console.log(error);
          this.alertsService.addAlert({
            type: 'danger',
            message: 'Something went wrong while resetting your password. Please try again.'
          }, true);          
        }
      );
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params.hasOwnProperty('token')) {
      this.accountService.setUser(params['token']);
    } else {
      this.wasError = true;
      this.alertsService.addAlert({
        type: 'danger',
        message: 'The URL is malformed. Please try to click on the link in your email again.'
      });
    }
  }

}
