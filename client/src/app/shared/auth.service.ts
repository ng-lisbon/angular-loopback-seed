import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Account, AccessToken } from './sdk/models';
import { AccountApi } from './sdk/services';

@Injectable()
export class AuthService {
  account: Account;

  constructor(private accountApi: AccountApi) {
  }

  registerUser(account: Account): Observable<Account> {
    return this.accountApi.create(account);
  }

  verifyMail(userId: string, token: string): Observable<any> {
    return this.accountApi.verifyconfirm(userId, token);
    // const auth = this.fbApp.auth();
    // return auth.applyActionCode(oobCode)
    // .catch((error) => {
    //   console.log(error);
    //   throw error;
    // });
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

  loginUser(email, password): Observable<AccessToken> {
    const account = new Account();
    account.email = email;
    account.password = password;
    return this.accountApi.login(account);
    // const promise = this.angularFire.auth.login(user)
    // .catch((error) => {
    //   console.log('Error in auth service, loginUser: ' + error);
    //   throw error;
    // });
    // return Observable.fromPromise(<Promise<FirebaseAuthState>>promise);
  }

  logout(): Observable<any> {
    return this.accountApi.logout();
    // return this.angularFire.auth.logout()
    // .catch((error) => {
    //   console.log(error);
    //   throw error;
    // });
  }

  sendPasswordRequestMail(email: string): Observable<any> {
    return new Observable();
    // const auth = this.fbApp.auth();
    // return Observable.fromPromise(<Promise<any>>auth.sendPasswordResetEmail(email));
  }

  getMailAddress(): Observable<string> {
    return new Observable();
  }

  setMailAddress(newEmail: string): Observable<any> {
    return new Observable();
    // return this.angularFire.auth.first()
    // .flatMap(
    //   (auth) => {
    //     const credential = firebase.auth.EmailAuthProvider.credential(
    //       auth.auth.email, newUser.password
    //     );
    //     const authenticated = new Subject<FirebaseAuthState>();
    //     auth.auth.reauthenticate(credential)
    //     .then(() => authenticated.next(auth))
    //     .catch((error) => authenticated.error(error));
    //     return authenticated;
    //   }
    // )
    // .flatMap(
    //   (auth) => auth.auth.updateEmail(newUser.email)
    // );
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
    return this.account != null;
    // return this.angularFire.auth.map(
    //   (auth) => {
    //     if (auth == null) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    // );
  }
}
