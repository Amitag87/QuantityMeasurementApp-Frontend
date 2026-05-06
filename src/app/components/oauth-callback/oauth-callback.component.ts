import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-page">
      <div class="callback-card" *ngIf="!error">
        <div class="spinner-ring"></div>
        <p class="status-text">Completing sign-in...</p>
      </div>
      <div class="callback-card error-card" *ngIf="error">
        <span class="error-icon">⚠</span>
        <p class="status-text">{{ error }}</p>
        <a routerLink="/login" class="back-btn">Back to Login</a>
      </div>
    </div>
  `,
  styles: [`
    .callback-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .callback-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 3rem;
      background: rgba(15,15,30,0.8);
      border: 1px solid rgba(99,231,196,0.12);
      border-radius: 20px;
    }
    .error-card { border-color: rgba(255,80,80,0.2); }
    .spinner-ring {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(99,231,196,0.2);
      border-top-color: #63e7c4;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .status-text { color: rgba(255,255,255,0.7); font-size: 1rem; margin: 0; }
    .error-icon { font-size: 2.5rem; }
    .back-btn {
      padding: 0.5rem 1.5rem;
      border-radius: 8px;
      background: rgba(99,231,196,0.12);
      color: #63e7c4;
      text-decoration: none;
      font-size: 0.9rem;
    }
  `]
})
export class OauthCallbackComponent implements OnInit {
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.auth.handleOAuthCallback(token);
      this.router.navigate(['/history']);
    } else {
      this.error = 'Authentication failed. No token received.';
    }
  }
}
