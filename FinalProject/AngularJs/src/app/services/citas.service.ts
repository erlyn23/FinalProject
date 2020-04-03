import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Citas } from '../Models/Citas';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { CitaArreglada } from '../Models/CitaArreglada';
import {retry, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  url = "https://localhost:44347/api/Citas";
  constructor(private http: HttpClient) { }

  ObtenerCitas(): Observable<CitaArreglada[]>
  {
    return this.http.get<CitaArreglada[]>(this.url).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorMedico(med: string): Observable<CitaArreglada[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<CitaArreglada[]>(this.url+"/PorMedico/"+med, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorPaciente(pac: string): Observable<CitaArreglada[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<CitaArreglada[]>(this.url+"/PorPaciente/"+pac, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorFecha(fech: string): Observable<CitaArreglada[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<CitaArreglada[]>(this.url+"/PorFecha/"+fech, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerTotal(filtro: string, busqueda:string, total:boolean): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<number>(this.url+"/Total/"+filtro+"/"+busqueda+"/"+total, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  AgregarCita(citas: Citas):Observable<Citas>{
  
      const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
      return this.http.post<Citas>(this.url+"/AgregarCita", citas, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
        alert(error.error.Message);
        return throwError(error.error.Message);
      }));
  }

  BorrarCita(id: string, tipo:string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }
}

