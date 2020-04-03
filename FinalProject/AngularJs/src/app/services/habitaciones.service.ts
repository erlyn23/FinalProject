import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Habitaciones } from '../Models/Habitaciones';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  url = "https://localhost:44347/api/Habitaciones"
  constructor(private http: HttpClient) { }

  ObtenerHabitaciones(): Observable<Habitaciones[]>{
    return this.http.get<Habitaciones[]>(this.url).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorTipo(tip:string):Observable<Habitaciones[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Habitaciones[]>(this.url+"/PorTipo/"+tip, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  AgregarHabitacion(habitacion: Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Habitaciones>(this.url+"/AgregarHabitacion", habitacion, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ModificarHabitacion(habitacion:Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.put<Habitaciones>(this.url, habitacion, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  EliminarHabitacion(id: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id,httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }
}
