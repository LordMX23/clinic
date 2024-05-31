import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { MenuService } from './services/menu.service';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/interfaces/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent {

  private serviceMenu = inject(MenuService);
  private authService = inject(AuthService);

  public user = computed(()=> this.authService.currentUser());

  // private router = inject( Router );
  //public sidebarItems = computed(() => this.serviceMenu.menuItems);

  public sidebarItems = [
    {label: 'Home', icon: 'dashboard', url:'./home'},
    {label: 'Search', icon: 'search', url:'./search'},
    {label: '...', icon: 'label', url:'./home'}
  ];

  onLogout()
  {
    this.authService.logout();
  }

}
