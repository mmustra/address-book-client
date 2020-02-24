import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import * as randomMaterialColor from 'random-material-color';
import { of } from 'rxjs';
import { finalize, flatMap, take } from 'rxjs/operators';

import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAvatar } from '../../../../../shared/interfaces/avatar.interface';
import { ValidatorService } from '../../../../../shared/services/validator.service';
import { IUser } from '../../../users/interfaces/user.interface';
import { ProfileService } from '../../../users/modules/profile/services/profile.service';
import { IContact } from '../../interfaces/contact.interface';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-single-contact',
  templateUrl: './single-contact.component.html',
  styleUrls: ['./single-contact.component.less']
})
export class SingleContactComponent implements OnInit, OnDestroy {
  @ViewChildren('phoneElemControls') phoneElemControls: QueryList<any>;
  @ViewChildren('emailElemControls') emailElemControls: QueryList<any>;

  profile: IUser;
  contact: IContact;
  avatar: IAvatar;
  contactForm: FormGroup;
  editMode: boolean;
  isProcessing: boolean;
  emailValidators: ValidatorFn[];
  phoneValidators: ValidatorFn[];

  get formPhones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }
  get formEmails(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private contactsService: ContactsService,
    private messageService: NzMessageService,
    private validatorService: ValidatorService
  ) {
    this.avatar = { text: '', color: '', src: '' };
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', []],
      avatarUrl: [''],
      notes: [''],
      phones: new FormArray([]),
      emails: new FormArray([])
    });
    this.phoneValidators = [this.validatorService.phoneValidator];
    this.emailValidators = [this.validatorService.emailValidator];
  }

  ngOnInit(): void {
    this.profile = this.profileService.profile;

    this.route.params
      .pipe(
        take(1),
        flatMap(params => {
          if (!params.id) {
            return of(null);
          }
          return this.contactsService.getAndActivateContact$(params.id);
        })
      )
      .subscribe(contact => {
        this.contact = contact;
        this.setContactData(this.contact);
      });
  }

  ngOnDestroy(): void {
    if (this.contactsService.activeContact) {
      this.contactsService.removeActiveContact$().subscribe();
    } else if (this.contactsService.contacts.length) {
      this.contactsService.removeContacts$().subscribe();
    }
  }

  removeControl(formArray: FormArray, index: number): void {
    if (formArray.length === 1) {
      formArray.controls[0].setValue('');
      return;
    }
    formArray.removeAt(index);
  }

  addControl(formArray: FormArray): void {
    let validators = [];
    let elemControls;

    if (formArray === this.formEmails) {
      validators = this.emailValidators;
      elemControls = this.emailElemControls;
    } else if (formArray === this.formPhones) {
      validators = this.phoneValidators;
      elemControls = this.phoneElemControls;
    }

    formArray.push(new FormControl('', validators));

    setTimeout(() => {
      if (elemControls) {
        elemControls.last.elementRef.nativeElement
          .querySelector('input')
          .focus();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/contacts']);
  }

  save(): void {
    _.forEach(this.contactForm.controls, control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (this.contactForm.invalid) {
      return;
    }

    this.isProcessing = true;
    const cachedActiveContact = this.contactsService.activeContact;
    const fullName = `${this.contactForm.get('firstName').value} ${
      this.contactForm.get('lastName').value
    }`.trim();

    of(null)
      .pipe(
        flatMap(() => {
          if (!cachedActiveContact) {
            return this.contactsService.createContact$(this.contactForm.value);
          } else {
            return this.contactsService.updateContact$(
              cachedActiveContact.id,
              this.contactForm.value
            );
          }
        }),
        finalize(() => (this.isProcessing = false))
      )
      .subscribe(() => {
        this.router.navigate(['/contacts']);
        this.messageService.create(
          'success',
          `Contact ${fullName} ${cachedActiveContact ? 'updated' : 'created'}.`
        );
      });
  }

  private setContactData(contact: IContact): void {
    const phonesFormArray = this.contactForm.controls.phones as FormArray;
    const emailsFormArray = this.contactForm.controls.emails as FormArray;

    if (!contact) {
      emailsFormArray.push(new FormControl('', this.emailValidators));
      phonesFormArray.push(new FormControl('', this.phoneValidators));
      return;
    }

    this.avatar.text = `${_.get(contact, 'firstName[0]', '')}${_.get(
      contact,
      'lastName[0]',
      ''
    )}`;

    this.avatar.color = randomMaterialColor.getColor({
      text: this.avatar.text
    });
    this.avatar.src = contact.avatarUrl;

    this.contactForm.get('firstName').setValue(contact.firstName);
    this.contactForm.get('lastName').setValue(contact.lastName);
    this.contactForm.get('notes').setValue(contact.notes);
    this.contactForm.get('avatarUrl').setValue(contact.avatarUrl);

    if (contact.emails.length) {
      _.forEach(contact.emails, email => {
        emailsFormArray.push(new FormControl(email, this.emailValidators));
      });
    } else {
      emailsFormArray.push(new FormControl('', this.emailValidators));
    }

    if (contact.phones.length) {
      _.forEach(contact.phones, phone => {
        phonesFormArray.push(new FormControl(phone, this.phoneValidators));
      });
    } else {
      phonesFormArray.push(new FormControl('', this.phoneValidators));
    }
  }
}
