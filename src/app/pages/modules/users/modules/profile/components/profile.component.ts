import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import * as randomMaterialColor from 'random-material-color';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IAvatar } from '../../../../../../shared/interfaces/avatar.interface';
import { ValidatorService } from '../../../../../../shared/services/validator.service';
import { IUser } from '../../../interfaces/user.interface';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {
  destroy$: Subject<void>;
  profile$: Observable<IUser>;
  avatar: IAvatar;
  profileForm: FormGroup;
  editMode: boolean;
  isProcessing: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly profileService: ProfileService,
    private messageService: NzMessageService,
    private validatorService: ValidatorService
  ) {
    this.destroy$ = new Subject();
    this.avatar = { text: '', color: '', src: '' };
  }

  ngOnInit() {
    this.profile$ = this.profileService.profile$;
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, this.validatorService.emailValidator]],
      password: [null, [Validators.required]],
      passwordCheck: [null, [Validators.required, this.passwordValidator]],
      avatarUrl: ['']
    });
    const watchChanges = true;
    this.setProfileData(watchChanges);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() =>
      this.profileForm.controls.passwordCheck.updateValueAndValidity()
    );
  }

  private passwordValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.profileForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  cancel(): void {
    this.editMode = false;
    this.setProfileData();
  }

  update(): void {
    _.forEach(this.profileForm.controls, control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (this.profileForm.invalid) {
      return;
    }

    this.isProcessing = true;
    this.setControlsAvailability(false);

    this.profileService.updateProfile$(this.profileForm.value).subscribe(
      () => {
        this.editMode = false;
        this.isProcessing = false;
        this.setControlsAvailability(true);
        this.messageService.create('success', 'Profile details updated.');
      },
      error => {
        this.isProcessing = false;
        this.setControlsAvailability(true);
        if (error.statusCode === 405) {
          this.cancel();
        }
      }
    );
  }

  private setProfileData(watchChanges: boolean = false): Subscription {
    let profile$: Observable<IUser> = this.profile$.pipe(
      takeUntil(this.destroy$)
    );

    if (!watchChanges) {
      profile$ = profile$.pipe(take(1));
    }

    profile$ = profile$.pipe(filter(n => !_.isNil(n)));

    return profile$.subscribe(profile => {
      this.avatar.text = `${profile.firstName[0]}${profile.lastName[0]}`;
      this.avatar.color = randomMaterialColor.getColor({
        text: this.avatar.text
      });
      this.avatar.src = profile.avatarUrl;
      this.profileForm.reset();
      this.profileForm.get('email').setValue(profile.email);
      this.profileForm.get('password').setValue(null);
      this.profileForm.get('passwordCheck').setValue(null);
      this.profileForm.get('firstName').setValue(profile.firstName);
      this.profileForm.get('lastName').setValue(profile.lastName);
      this.profileForm.get('avatarUrl').setValue(profile.avatarUrl);
    });
  }

  private setControlsAvailability(avaliable: boolean = true): void {
    _.forEach(this.profileForm.controls, control => {
      avaliable ? control.enable() : control.disable();
    });
  }
}
