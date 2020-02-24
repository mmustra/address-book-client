import { TestBed } from '@angular/core/testing';

import { ContactsApiService } from './contacts.api.service';

describe('ContactApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactsApiService = TestBed.get(ContactsApiService);
    expect(service).toBeTruthy();
  });
});
