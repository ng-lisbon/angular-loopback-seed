import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../shared/auth.service';
import { AlertsService } from '../shared/alerts/alerts.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styles: []
})
export class ActionComponent implements OnInit {
  wasVerified = false;
  wasVerifiedError = false;
  wasPasswordReset = false;
  wasPasswordResetError = false;
  oobCode: string;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService, private alertsService: AlertsService) { }

  onSetPassword(form: NgForm) {
    this.authService.confirmPasswordReset(this.oobCode, form.value.password)
    .subscribe(
      () => {
        form.reset();
        this.alertsService.addAlert({
          type: 'success',
          message: 'Your password was set successfully. Please try to login now.'
        }, true);
      },
      (error) => {
        console.log(error);
        this.wasPasswordResetError = true;
      }
    );
  }
  
  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const mode = queryParams['mode'];
    const apiKey = queryParams['apiKey'];
    this.oobCode = queryParams['oobCode'];
    if (mode == 'verifyEmail') {
      this.authService.verifyMail(this.oobCode, apiKey)
      .subscribe(
        () => this.wasVerified = true,
        (error) => this.wasVerifiedError = true
      );
    } else if (mode == 'resetPassword') {
      const oobCode = queryParams['oobCode'];
      this.authService.verifyPasswordReset(this.oobCode)
      .subscribe(
        () => this.wasPasswordReset = true,
        (error) => {
          this.wasPasswordResetError = true;
          console.log(error);
        }
      );
    }
  }

}
