import { Component, OnInit } from '@angular/core';
import { TenantService } from '../tenant.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.css'],
})
export class TenantListComponent {
  supabase = createClient(
    'https://lqviihvmwdkabqlpecxh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdmlpaHZtd2RrYWJxbHBlY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMzgxNDAsImV4cCI6MjAxNDkxNDE0MH0.970stIqUsgdhPxejzbb-6R39pDOAx3J4rIGWz_c6ZAM'
  );
  tenants: any[] = [];
  createUserForm: FormGroup;
  editUserForm: FormGroup;
  loggedInUserName: string = '';

  constructor(
    private tenantData: TenantService,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: SupabaseService
  ) {
    this.createUserForm = this.formBuilder.group({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // Initialize Edit User Form
    this.editUserForm = this.formBuilder.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      // department: [''],
      department: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchTenants();
    const storedFirstName = localStorage.getItem('tenantName');

    // Set the value to loggedInUserName if it exists
    if (storedFirstName) {
      this.loggedInUserName = storedFirstName;
    }
  }

  async fetchTenants() {
    const storedFirstName = localStorage.getItem('tenantName');

    if (storedFirstName) {
      this.loggedInUserName = storedFirstName;

      // Fetch all tenants from the service
      this.tenantData.getAllTenants().subscribe((data: any) => {
        // Filter tenants based on the condition
        this.tenants = data.filter(
          (tenant: any) => tenant.tenantName === storedFirstName
        );
      });
    } else {
      console.error('TenantName not found in local storage.');
    }
  }

  async createUser() {
    debugger;
    if (this.createUserForm.valid) {
      const formData = this.createUserForm.value;

      // Fetch the stored tenantName from local storage
      const storedTenantName = localStorage.getItem('tenantName');

      if (!storedTenantName) {
        console.error('TenantName not found in local storage.');
        return;
      }

      const tenantRequest = {
        id: formData.id,
        email: formData.email,
        department: formData.department,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        tenantName: storedTenantName, // Use the stored tenantName from local storage
      };

      try {
        // Sign up the user with Supabase
        const signupResult = await this.supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signupResult.error) {
          console.error('Supabase signup error:', signupResult.error);
          return;
        }

        // After successful signup, create a new tenant

        const { data: userData, error: userError } = await this.supabase
          .from('usertable')
          .upsert([tenantRequest]);

        if (userError) {
          console.error('Supabase user creation error:', userError);
          return;
        }

        // Call the createTenants API with the extracted data
        this.tenantData.createTenants(tenantRequest).subscribe(
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
        alert('Tenant creation successful');
        // Redirect to the login page or another appropriate route
      } catch (error) {
        console.error('Supabase error:', error);
      }
    }
  }

  editTenant(tenant: any) {
    // Implement the logic to populate the editUserForm with tenant data for editing.
    this.editUserForm.patchValue({
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      department: tenant.department,
    });
  }

  setFormValues(tenant: any) {
    this.editUserForm.setValue({
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      department: tenant.department,
    });
  }
  updateUser() {
    const formData = this.editUserForm.value;
    this.tenantData.updateTenant(formData).subscribe(() => {
      // Reload the entire page
    });
    window.location.reload();
  }

  deleteTenant(id: number) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this tenant?'
    );

    if (isConfirmed) {
      // If the user confirms, proceed with deletion
      this.tenantData.deleteTenant(id).subscribe(() => {
        // Remove the deleted tenant from the tenants array.
        this.tenants = this.tenants.filter((tenant) => tenant.id !== id);
        window.location.reload();
      });
    }
    window.location.reload();
  }
  logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
