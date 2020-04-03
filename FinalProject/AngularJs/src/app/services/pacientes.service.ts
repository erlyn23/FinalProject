import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Pacientes } from '../Models/Pacientes';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  url = "https://localhost:44347/api/Pacientes";
  constructor(private http: HttpClient) { }

  ObtenerPacientes(): Observable<Pacientes[]>
  {
    return this.http.get<Pacientes[]>(this.url).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorCedula(ced:string): Observable<Pacientes[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Pacientes[]>(this.url+"/PorCedula/"+ced, httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorNombre(nom:string): Observable<Pacientes[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Pacientes[]>(this.url+"/PorNombre/"+nom,httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorAsegurado(asg: string): Observable<Pacientes[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Pacientes[]>(this.url+"/PorAsegurados/"+asg,httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ObtenerTotal(filtro: string, busqueda:string, total:boolean):Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<number>(this.url+"/Total/"+filtro+"/"+busqueda+"/"+total,httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  AgregarPaciente(paciente:Pacientes): Observable<Pacientes>{
    const httpOptions = {headers: new HttpHeaders({"Content-type": "application/json"})};
    return this.http.post<Pacientes>(this.url+"/AgregarPaciente",paciente,httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  ModificarPaciente(paciente:Pacientes): Observable<Pacientes>{
    const httpOptions = {headers: new HttpHeaders({"Content-type": "application/json"})};
    return this.http.put<Pacientes>(this.url, paciente, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }

  EliminarPaciente(id: string): Observable<number>
  {
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      alert(error.error.Message);
      return throwError(error.error.Message);
    }));
  }
}
