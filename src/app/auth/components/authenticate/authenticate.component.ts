import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Role } from '../../../shared/enums/role.enum';
import { ValidatorService } from '../../../shared/services/validator.service';
import { AuthAuthenticateTab } from '../../enums/auth-authenticate-tab.enum';
import { IAuthLoginRequest } from '../../interfaces/auth-login-request';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.less']
})
export class AuthenticateComponent implements OnInit {
  Role = Role;
  loginForm: FormGroup;
  registerForm: FormGroup;
  redirectUrl: string;
  redirectQueryParams: Params | null;
  isLoading: boolean;
  selectedTab: AuthAuthenticateTab;
  quickLoginsMap: Map<Role, IAuthLoginRequest>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private validatorService: ValidatorService
  ) {
    this.selectedTab = AuthAuthenticateTab.Login;
    this.quickLoginsMap = new Map([
      [Role.Admin, { email: 'admin@admin.com', password: 'admin' }],
      [
        Role.Moderator,
        { email: 'moderator@moderator.com', password: 'moderator' }
      ],
      [Role.User, { email: 'user@user.com', password: 'user' }]
    ]);
  }

  ngOnInit(): void {
    this.redirectUrl = _.get(
      this.activatedRoute,
      'snapshot.queryParams.redirectUrl',
      '/'
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.validatorService.emailValidator]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, this.validatorService.emailValidator]],
      password: ['', [Validators.required]],
      passwordCheck: ['', [Validators.required, this.passwordValidator]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      avatarUrl: ['']
    });
  }

  submit(request?: IAuthLoginRequest): void {
    if (this.isLoading) {
      return;
    }

    let payload = request;
    let submitMethod = 'login$';

    if (!request) {
      const form =
        this.selectedTab === AuthAuthenticateTab.Login
          ? this.loginForm
          : this.registerForm;

      _.forEach(form.controls, control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });

      if (form.invalid) {
        return;
      }

      payload = form.value;
      submitMethod =
        this.selectedTab === AuthAuthenticateTab.Login ? 'login$' : 'register$';
    }

    this.isLoading = true;

    this.authService[submitMethod](payload).subscribe(
      () => {
        this.router.navigate([this.redirectUrl]);
      },
      () => (this.isLoading = false)
    );
  }

  quickLogin(role: Role) {
    const loginRequest = this.quickLoginsMap.get(role);
    this.submit(loginRequest);
  }

  tabChange(tabIndex: number): void {
    this.selectedTab = tabIndex;
    const prevForm =
      tabIndex === AuthAuthenticateTab.Login
        ? this.registerForm
        : this.loginForm;
    this.resetForm(prevForm);
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() =>
      this.registerForm.controls.passwordCheck.updateValueAndValidity()
    );
  }

  private passwordValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
    // tslint:disable-next-line
  };

  private resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.controls[key].setErrors(null);
    });
  }
}
