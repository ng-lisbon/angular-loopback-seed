import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertsService } from '../../shared/alerts/alerts.service';
import { AccountService } from '../../shared/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styles: []
})
export class ConfirmEmailComponent implements OnInit {
  wasError = false;

  constructor(private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService, private accountService: AccountService) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params.hasOwnProperty('userId') && params.hasOwnProperty('token')) {
      this.accountService.verifyMail(params['userId'], params['token'])
      .subscribe(
        () => this.wasError = false,
        (error) => {
          let message = 'Your email address could not be verified. Please try to click on the link in your email again.';
          if (error.code == 'USER_CONFIRMED') {
            message = 'This mail address was confirmed already. You can try to log in now.';
          } else if (error.code == 'USER_NOT_FOUND') {
            message = 'We could not found the user in our database. Please try again or register.';
          }
          this.wasError = true;
          this.alertsService.addAlert({
            type: 'danger',
            message: message
          });
        }
      );
    } else {
      this.wasError = true;
      this.alertsService.addAlert({
        type: 'danger',
        message: 'The URL is malformed. Please try to click on the link in your email again.'
      });
    }
  }

}
