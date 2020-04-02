import { Injectable } from '@angular/core';
import { Medicos } from '../Models/Medicos';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  url = "https://localhost:44347/api/Medicos"
  constructor(private http: HttpClient) { }

  ObtenerMedicos(): Observable<Medicos[]>{
    return this.http.get<Medicos[]>(this.url);
  }

  ObtenerPorNombre(filtro:string): Observable<Medicos[]>{
    const httpOptions = {headers: new HttpHeaders({"content-type":"application/json"})}
    return this.http.get<Medicos[]>(this.url+"/PorNombre/"+filtro, httpOptions).pipe(retry(1),catchError((err)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  ObtenerPorEspecialidad(filtro:string): Observable<Medicos[]>{
    const httpOptions = {headers: new HttpHeaders({"content-type":"application/json"})}
    return this.http.get<Medicos[]>(this.url+"/PorEspecialidad/"+filtro).pipe(retry(1),catchError((err)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  AgregarMedico(medico: Medicos): Observable<Medicos>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Medicos>(this.url+"/AgregarMedico", medico, httpOptions).pipe(retry(1),catchError((err)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  ModificarMedico(medico: Medicos)
  {
    const httpOptions = {headers: new HttpHeaders({'Content-type':'application/json'})}
    return this.http.put<Medicos>(this.url, medico, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  BorrarMedico(idMedico: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({'Content-type':'application/json'})};
    return this.http.delete<number>(this.url+"?id="+idMedico, httpOptions).pipe(retry(1),catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error);
    }));
  }
}
