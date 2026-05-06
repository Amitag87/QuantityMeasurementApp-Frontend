import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mode = signal<Mode>('login');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  toggleMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set(null);
    this.success.set(null);
  }

  submit(): void {
    this.error.set(null);
    this.success.set(null);

    if (!this.email() || !this.password()) {
      this.error.set('Please fill in all fields.');
      return;
    }

    if (this.mode() === 'register' && this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    const call = this.mode() === 'login'
      ? this.auth.login(this.email(), this.password())
      : this.auth.register(this.email(), this.password());

    call.subscribe({
      next: () => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParams['redirect'] || '/';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Authentication failed. Please try again.');
      }
    });
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }
}
