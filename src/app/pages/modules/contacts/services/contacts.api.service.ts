import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { IContactPayload } from '../interfaces/contact-payload.interface';
import { IContact } from '../interfaces/contact.interface';
import { IContactsQuery } from '../interfaces/contacts-query.interface';
import { IContactsResponse } from '../interfaces/contacts-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactsApiService extends ApiService {
  constructor(private http: HttpClient, private store: Store) {
    super();
  }

  getAllContacts$(
    options?: Omit<IContactsQuery, 'totalPages'>
  ): Observable<IContactsResponse> {
    const url = `${this.apiUrl}/contacts`;

    return this.http.get<IContactsResponse>(url, {
      params: {
        page: _.get(options, 'page', ''),
        limit: _.get(options, 'limit', ''),
        textSearch: _.get(options, 'textSearch', ''),
        any: _.get(options, 'any', '')
      }
    });
  }

  getContact$(contactId: string): Observable<IContact> {
    const url = `${this.apiUrl}/contacts/${contactId}`;

    return this.http.get<IContact>(url);
  }

  createContact$(payload: Partial<IContactPayload>): Observable<IContact> {
    const url = `${this.apiUrl}/contacts`;

    return this.http.post<IContact>(url, payload);
  }

  updateContact$(
    contactId: string,
    payload: Partial<IContactPayload>
  ): Observable<IContact> {
    const url = `${this.apiUrl}/contacts/${contactId}`;

    return this.http.patch<IContact>(url, payload);
  }

  deleteContact$(contactId: string): Observable<void> {
    const url = `${this.apiUrl}/contacts/${contactId}`;

    return this.http.delete<void>(url);
  }
}
