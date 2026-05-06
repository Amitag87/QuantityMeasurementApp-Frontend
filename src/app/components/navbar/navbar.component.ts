import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: { name?: string; email?: string } | null = null;
  menuOpen = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
      this.user = state ? this.auth.getUser() : null;
    });
  }

  logout(): void {
    this.auth.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  getInitials(): string {
    if (this.user?.name) return this.user.name.charAt(0).toUpperCase();
    if (this.user?.email) return this.user.email.charAt(0).toUpperCase();
    return 'U';
  }
}
