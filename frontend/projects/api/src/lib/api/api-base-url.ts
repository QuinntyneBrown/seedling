import { InjectionToken } from '@angular/core';

/** The backend origin every service prefixes its routes with; bound from `environment.apiBaseUrl`. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
