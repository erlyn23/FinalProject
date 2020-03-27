import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaArreglada } from '../Models/CitaArreglada';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  url = 'http://localhost:44743/'
  constructor(private http: HttpClient) { }
  ObtenerCitas(): Observable<CitaArreglada[]>
  {
    return this.http.get<CitaArreglada[]>(this.url);
  }
}
