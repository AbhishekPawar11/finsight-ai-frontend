import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { MATERIAL_MODULES } from '../../material.imports'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [CommonModule, ...MATERIAL_MODULES, RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
    isMobileMenuOpen = false;

    constructor(private authService:AuthService , private router:Router){}
    
    toggleMobileMenu(){
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    logout(){
       this.authService.logout();
       this.router.navigate(['/login']);
    }

}
