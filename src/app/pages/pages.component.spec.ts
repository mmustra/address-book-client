import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PagesComponent } from './pages.component';

describe('PagesComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PagesComponent]
    }).compileComponents();
  }));

  it('should create the pages', () => {
    const fixture = TestBed.createComponent(PagesComponent);
    const pages = fixture.debugElement.componentInstance;
    expect(pages).toBeTruthy();
  });
});
