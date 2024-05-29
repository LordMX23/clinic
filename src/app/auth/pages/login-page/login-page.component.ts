import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styles: `
  .gradient-custom {
/* fallback for old browsers */
background: #6a11cb;

/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-linear-gradient(to right, rgba(0,181,254, 1), rgba(0,228,254, 1));

/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: linear-gradient(to right, rgba(63,81,181, 1), rgba(63,81,181, 1))
}
  `,
})
export default class LoginPageComponent {
  private fb = inject(FormBuilder)

  public myForm: FormGroup = this.fb.group({
    email:    ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  });

  login(){
    console.log(this.myForm.value);
  }
}
