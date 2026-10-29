import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { API_BASE_URL } from './api-base-url';

describe('API_BASE_URL', () => {
  it('is provided by the composition root', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: API_BASE_URL, useValue: 'http://localhost:5100' }],
    });
    expect(TestBed.inject(API_BASE_URL)).toBe('http://localhost:5100');
  });
});
