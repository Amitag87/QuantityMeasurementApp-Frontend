import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.6);">
      <div class="loader"></div>
      <p style="margin-top:1.5rem;">Completing sign-in…</p>
    </div>
  `,
  styles: [`
    .loader {
      width: 44px; height: 44px;
      border: 3px solid rgba(99,232,200,0.15);
      border-top-color: #63e8c8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const name = params['name'];
      const email = params['email'];
      
      if (token) {
        this.auth.handleOAuthToken(token, name, email);
        const redirect = params['redirect'] || this.auth.getOAuthRedirect() || '/';
        this.auth.clearOAuthRedirect();
        this.router.navigate([redirect]);
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }
}
