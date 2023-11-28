import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { SignupComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginuserComponent } from './loginuser/loginuser.component';

const routes: Routes = [{path:"login",component:LoginComponent},{path:"mainpage",component:TenantListComponent ,canActivate: [AuthGuard]},{path:"signup",component:SignupComponent},{path:'log',component:LoginuserComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
