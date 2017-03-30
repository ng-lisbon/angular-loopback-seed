import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private accountService: AccountService, private router: Router) { }

  onLogout() {
    this.accountService.logout()
    .subscribe(() => this.router.navigate(['/auth', 'login']));
  }

  ngOnInit() {
    this.isAuthenticated = this.accountService.isAuthenticated();
  }

}
