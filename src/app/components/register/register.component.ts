import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material.imports'

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,...MATERIAL_MODULES,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
   registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // On successful registration, redirect straight to the login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        // You can customize this based on what your Spring Boot backend returns (e.g., 409 Conflict)
        this.errorMessage = 'Registration failed. Email or username might already be in use.';
        console.error('Registration error:', err);
      }
    });
  }
}
