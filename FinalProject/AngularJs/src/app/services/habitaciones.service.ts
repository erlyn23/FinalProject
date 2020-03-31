import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitaciones } from '../Models/Habitaciones';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  url = "https://localhost:44347/api/Habitaciones"
  constructor(private http: HttpClient) { }

  ObtenerHabitaciones(): Observable<Habitaciones[]>{
    return this.http.get<Habitaciones[]>(this.url);
  }

  AgregarHabitacion(habitacion: Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Habitaciones>(this.url, habitacion, httpOptions)
  }

  ModificarHabitacion(habitacion:Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.put<Habitaciones>(this.url, habitacion, httpOptions);
  }

  EliminarHabitacion(id: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id,httpOptions);
  }
}
