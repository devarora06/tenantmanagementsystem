import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-loginuser',
  templateUrl: './loginuser.component.html',
  styleUrls: ['./loginuser.component.css']
})
export class LoginuserComponent {
  
  loggedInUserName: string | null = null;
  supabase = createClient(
    'https://lqviihvmwdkabqlpecxh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdmlpaHZtd2RrYWJxbHBlY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMzgxNDAsImV4cCI6MjAxNDkxNDE0MH0.970stIqUsgdhPxejzbb-6R39pDOAx3J4rIGWz_c6ZAM'
  );
  constructor(private router: Router,private toast: NgToastService) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email: this.loginForm.value.email as string,
          password: this.loginForm.value.password as string,
        });
  
        if (error) {
          console.error('Login error:', error);
          
          // Show SweetAlert2 error notification for invalid login
          Swal.fire({
            icon: 'error',
            title: 'Invalid Login',
            text: 'Please check your email and password and try again.',
          });
  
          return;
        } else if (data) {
          const { data: userData, error: fetchError } = await this.supabase
            .from('usertable')
            .select('id, tenantName') // Add 'tenantName' to the select query
            .eq('email', email)
            .single();
  
          if (fetchError) {
            console.error('Fetch user data error:', fetchError);
            return;
          } else if (userData) {
            const { id, tenantName } = userData;
  
            // Store the user details in local storage
            localStorage.setItem('id', id);
            localStorage.setItem('tenantName', tenantName);
            this.loggedInUserName = tenantName;
            console.log(this.loggedInUserName);
            localStorage.setItem('token', '6767676767');
            
            // Show SweetAlert2 success notification for valid login
            Swal.fire({
              icon: 'success',
              title: 'Login successful!',
            });
  
            // Redirect to a different route or perform other actions upon successful login
            this.router.navigate(['/mainpage'], { queryParams: { id: id } });
          }
        }
      } catch (error) {
        // Show SweetAlert2 error notification for unexpected error
        Swal.fire({
          icon: 'error',
          title: 'Unexpected error',
          text: 'Please try again later.',
        });
  
        console.error('Unexpected error:', error);
      }
    }
  }
}
