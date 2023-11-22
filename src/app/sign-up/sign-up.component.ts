import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { TenantService } from '../tenant.service';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignupComponent {
  supabase = createClient(
    'https://lqviihvmwdkabqlpecxh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdmlpaHZtd2RrYWJxbHBlY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMzgxNDAsImV4cCI6MjAxNDkxNDE0MH0.970stIqUsgdhPxejzbb-6R39pDOAx3J4rIGWz_c6ZAM'
  );

  signupForm = new FormGroup({
    id: new FormControl(0),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    tenantName: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private router: Router, private tenantService: TenantService) {}

  async onSubmit() {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, department, tenantName, password } =
        this.signupForm.value;

      try {
        // Check if the tenant name already exists
        const existingTenants = (await this.tenantService
          .getAllTenants()
          .toPromise()) as any[];

        if (
          existingTenants &&
          existingTenants.some(
            (tenant: any) => tenant.tenantName === tenantName
          )
        ) {
          // Tenant name already exists, show an error message or take appropriate action
          alert('Tenant name already exists');
          return;
        }

        // Sign up the user with Supabase
        const signupResult = await this.supabase.auth.signUp({
          email: (email ?? '').toString(),
          password: (password ?? '').toString(),
        });

        if (signupResult.error) {
          console.error('Supabase signup error:', signupResult.error);
          return;
        }

        // After successful signup, create a new tenant
        const tenantRequest = {
          id: 0,
          email,
          department,
          firstName,
          lastName,
          password,
          tenantName,
        };

        const { id, ...dataWithoutId } = this.signupForm.value;
        const { data: userData, error: userError } = await this.supabase
          .from('usertable')
          .upsert([dataWithoutId]);

        if (userError) {
          console.error('Supabase user creation error:', userError);
          return;
        }

        // Call the createTenants API with the extracted data
        this.tenantService.createTenants(tenantRequest).subscribe(
          (data) => {
            // Handle success response from createTenant API
            console.log('createTenant API response:', data);
          },
          (error) => {
            // Handle error response from createTenant API
            console.error('createTenant API error:', error);
          }
        );

        // Successful signup
        alert('Signup and Tenant creation successful');

        // Redirect to the login page or another appropriate route
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Supabase error:', error);
      }
    }
  }
}
