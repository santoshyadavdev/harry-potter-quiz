import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models/character.model';
import { Spell } from '../models/spell.model';

@Injectable({ providedIn: 'root' })
export class HpApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://hp-api.onrender.com/api';

  getAllCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters`);
  }

  getCharactersByHouse(house: string): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters/house/${house}`);
  }

  getStudents(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters/students`);
  }

  getStaff(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters/staff`);
  }

  getAllSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>(`${this.baseUrl}/spells`);
  }
}
