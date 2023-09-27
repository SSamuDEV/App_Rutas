import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap} from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL:string = "https://restcountries.com/v3.1";

  public cacheStore: CacheStore = {
    byCapital:   { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion:    { region: '', countries: [] },
  }


  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage():void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore))
  }

  private loadFromLocalStorage():void {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]>{
    return this.http.get<Country[]>(url)
    .pipe(
      // El OF devuelve un nuevo Observable.
      catchError(error => of([]))
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${ this.apiURL }/alpha/${ code }`;
    return this.http.get<Country[]>(url)
    .pipe(
      map( countries => countries.length > 0 ? countries[0]: null),
      catchError(error => of(null))
    );
  }


  searchCapital(term: string): Observable<Country[]> {
    const url = `${ this.apiURL }/capital/${ term }`;
    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => this.cacheStore.byCapital.countries = countries ),
        tap(() => this.saveToLocalStorage())
      );
  }
  searchCountry(term: string): Observable<Country[]> {
    const url = `${ this.apiURL }/name/${ term }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap((countries) => this.cacheStore.byCountries.countries = countries ),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchRegion(region: string): Observable<Country[]> {
    const url = `${ this.apiURL }/region/${ region }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap((countries) => this.cacheStore.byRegion.countries = countries ),
      tap(() => this.saveToLocalStorage())
    );
  }
}
