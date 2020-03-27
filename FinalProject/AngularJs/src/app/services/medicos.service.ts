import { Injectable } from '@angular/core';
import { Medicos } from '../Models/Medicos';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  url = "https://localhost:44347/api/Medicos"
  constructor(private http: HttpClient) { }

  ObtenerMedicos(): Observable<Medicos[]>{
    return this.http.get<Medicos[]>(this.url + "/ObtenerTodos");
  }
}
