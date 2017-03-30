import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogout() {
    this.authService.logout()
    .subscribe(() => this.router.navigate(['/auth', 'login']));
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

}
