import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadComponent } from './components/upload/upload.component';
import { LedgerComponent } from './components/ledger/ledger.component';

export const routes: Routes = [
{path:'login' , component:LoginComponent},
{path:'register' , component:RegisterComponent},
{
    path:'',
    component:LayoutComponent,
    canActivate:[authGuard],
    children :[
         {path:'dashboard' , component:DashboardComponent},
         {path:'upload' , component:UploadComponent},
         {path:'ledger' , component:LedgerComponent},
        {path:'' , redirectTo:'dashboard' , pathMatch:'full'}
    ]
},
{path:'**', redirectTo:'/login',pathMatch:'full'},
];
