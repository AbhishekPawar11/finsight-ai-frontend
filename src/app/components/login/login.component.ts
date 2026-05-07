import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material.imports'
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,...MATERIAL_MODULES,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!:FormGroup;
  errorMessage:String = '';
  isLoading:boolean = false;

  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router : Router
  ){
       this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
     })
  }

   onSubmit(){
       if(this.loginForm.invalid){
          return;
       }
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.logout();
      this.authService.login(this.loginForm.value).subscribe({
        next:()=>{
           this.isLoading = false;
           this.router.navigate(['dashboard']);
        },
        error: (err:any)=>{
           this.isLoading = false;
           this.errorMessage= "Invalid email or password.Please try again.";
           console.log("login error" , err);
        }
      })
   }
}
