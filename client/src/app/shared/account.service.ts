import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Account, AccessToken } from './sdk/models';
import { AccountApi, LoopBackAuth } from './sdk/services';

@Injectable()
export class AccountService {
  authChange: Observable<AuthState>;

  private authManager: BehaviorSubject<AuthState>;
  private authState: AuthState;

  constructor(private accountApi: AccountApi,
      private loopBackAuth: LoopBackAuth) {
    if (this.accountApi.isAuthenticated()) {
      this.authManager = new BehaviorSubject(AuthState.LoggedIn);
    } else {
      this.authManager = new BehaviorSubject(AuthState.LoggedOut);      
    }
    this.authChange = this.authManager.asObservable();
  }

  registerUser(account: Account): Observable<Account> {
    return this.accountApi.create(account);
  }

  verifyMail(userId: string, token: string): Observable<any> {
    // TODO: Change to confirm method here and remove our own remote method
    return this.accountApi.verifyconfirm(userId, token);
  }

  verifyPasswordReset(oobCode: string): Observable<any> {
    return new Observable();
    // const auth = this.fbApp.auth();
    // const promise = auth.verifyPasswordResetCode(oobCode)
    // .catch((error) => {
    //   console.log(error);
    //   throw error;
    // });
    // return Observable.fromPromise(<Promise<any>>promise);
  }

  confirmPasswordReset(oobCode: string, newPassword: string): Observable<any> {
    return new Observable();
    // const auth = this.fbApp.auth();
    // const promise = auth.confirmPasswordReset(oobCode, newPassword)
    // .catch((error) => {
    //   console.log(error);
    //   throw error;
    // });
    // return Observable.fromPromise(<Promise<any>>promise);
  }

  loginUser(email: string, password: string): Observable<AccessToken> {
    const account = new Account();
    account.email = email;
    account.password = password;
    return this.accountApi.login(account)
    .map(
      (accessToken: AccessToken) => {
        this.setAuthState(AuthState.LoggedIn);
        return accessToken;
      }
    );
  }

  logout(): Observable<any> {
    return this.accountApi.logout()
    .map(
      () => this.setAuthState(AuthState.LoggedOut)
    );
  }

  sendPasswordRequestMail(email: string): Observable<any> {
    return new Observable();
    // const auth = this.fbApp.auth();
    // return Observable.fromPromise(<Promise<any>>auth.sendPasswordResetEmail(email));
  }

  getMailAddress(): string {
    return this.loopBackAuth.getCurrentUserData().email;
  }

  setMailAddress(newEmail: string, password: String): Observable<any> {
    const userId = this.loopBackAuth.getCurrentUserId();
    // TODO: Do password check server-side
    return this.accountApi.checkpassword(userId, password)
    .flatMap(
      (response) => {
        if (response['hasPassword']) {
          return this.accountApi.patchAttributes(userId, { email: newEmail });
        } else {
          throw new Error('WrongPassword');
        }
      }
    );
  }

  setPassword(oldPassword: string, newPassword: string): Observable<any> {
    const userId = this.loopBackAuth.getCurrentUserId();
    return this.accountApi.patchAttributes(userId, { password: newPassword,
      oldPassword: oldPassword });
  }

  isAuthenticated(): boolean {
    return this.accountApi.isAuthenticated();
  }

  emitAuthState() {
    this.authManager.next(this.authState);
  }

  private setAuthState(newAuthState: AuthState) {
    this.authState = newAuthState;
    this.emitAuthState();
  }
}

export const enum AuthState {
  LoggedIn,
  LoggedOut
}