/* tslint:disable:no-input-rename */
import * as _ from 'lodash';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';

import {
    Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit, OnChanges, OnDestroy {
  @Input('display') text: string;
  @Input() placeholder: string;
  @Input() minChars: number;
  @Input() debounceTime: number;
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  destroy$: Subject<void>;
  inputError: boolean;

  constructor() {
    this.destroy$ = new Subject();
    this.placeholder = 'Search';
    this.text = '';
    this.minChars = 1;
    this.debounceTime = 250;
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { minChars } = changes;
    this.inputError = false;

    if (!_.isUndefined(minChars)) {
      const value = minChars.currentValue;
      if (!(_.isNumber(value) && _.isFinite(value) && value > 0)) {
        this.inputError = true;
        throw new Error(
          `app-search: minChars needs to be type number, finite, greater then 0`
        );
      }
    }
  }

  ngOnInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        takeUntil(this.destroy$),
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(
          text =>
            !this.inputError && (!text.length || text.length >= this.minChars)
        ),
        debounceTime(this.debounceTime),
        tap(text => this.search.emit(text))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearTextSearch(): void {
    if (this.inputError || !this.text) {
      return;
    }
    this.text = '';
    this.search.emit(this.text);
  }
}
