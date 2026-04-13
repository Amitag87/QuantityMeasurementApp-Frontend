import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, AfterViewInit {
  mode: 'login' | 'register' = 'login';
  loading = false;
  error = '';
  success = '';
  redirectTo = '';

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  regName = '';
  regEmail = '';
  regPassword = '';
  regConfirm = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.route.queryParams.subscribe(p => {
      if (p['redirect']) {
        this.redirectTo = p['redirect'];
        this.auth.setOAuthRedirect(this.redirectTo);
      }
      if (p['token']) {
        // Direct login via token in query (e.g., from backend)
        this.auth.handleOAuthToken(p['token'], p['name'], p['email']);
        const redirect = p['redirect'] || '/';
        this.router.navigate([redirect]);
      }
    });
  }

  ngAfterViewInit(): void {
  }



  loginWithGoogle(): void {
    if (this.redirectTo) {
      this.auth.setOAuthRedirect(this.redirectTo);
    }
    window.location.href = `${environment.apiUrl.replace('/api/v1', '')}/oauth2/authorization/google`;
  }

  submitLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.redirectTo || '/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }

  submitRegister(): void {
    if (!this.regName || !this.regEmail || !this.regPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.regPassword !== this.regConfirm) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register({ name: this.regName, email: this.regEmail, password: this.regPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.redirectTo || '/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Email may already exist.';
      }
    });
  }

  switchMode(m: 'login' | 'register'): void {
    this.mode = m;
    this.error = '';
    this.success = '';
  }
}
