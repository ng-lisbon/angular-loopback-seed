import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Account, AccessToken } from './sdk/models';
import { AccountApi, LoopBackAuth } from './sdk/services';

@Injectable()
export class AccountService {
  account: Account;

  constructor(private accountApi: AccountApi,
    private loopBackAuth: LoopBackAuth) {
  }

  registerUser(account: Account): Observable<Account> {
    return this.accountApi.create(account);
  }

  verifyMail(userId: string, token: string): Observable<any> {
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
    const observable = this.accountApi.login(account);
    observable.subscribe(
      (accessToken) => {
        console.log(accessToken);
      }
    );
    return observable;
  }

  logout(): Observable<any> {
    return this.accountApi.logout();
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
    return this.accountApi.checkpassword(userId, password)
    .flatMap(
      (response) => {
        if (response['hasPassword']) {
          return this.accountApi.patchAttributes(userId, { email: newEmail });
          // const observable = this.accountApi.updateAttributes(userId, { email: newEmail });
          // observable.subscribe(
          //   (account) => console.log(account)
          // );
          // return observable;
        } else {
          throw new Error('WrongPassword');
        }
      }
    );
  }

  setPassword(oldPassword: string, newPassword: string): Observable<any> {
    return new Observable();
    // return this.angularFire.auth.first()
    // .flatMap(
    //   (auth) => {
    //     const credential = firebase.auth.EmailAuthProvider.credential(
    //       auth.auth.email, oldPassword
    //     );
    //     const authenticated = new Subject<FirebaseAuthState>();
    //     auth.auth.reauthenticate(credential)
    //     .then(() => authenticated.next(auth))
    //     .catch((error) => authenticated.error(error));
    //     return authenticated;
    //   }
    // )
    // .flatMap(
    //   (auth) => auth.auth.updatePassword(newPassword)
    // );
  }

  isAuthenticated(): boolean {
    return this.accountApi.isAuthenticated();
  }
}
