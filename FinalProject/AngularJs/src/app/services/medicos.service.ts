import { Injectable } from '@angular/core';
import { Medicos } from '../Models/Medicos';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  url = "http://sistemamedico.somee.com/api/Medicos"
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ObtenerMedicos(): Observable<Medicos[]>{
    return this.http.get<Medicos[]>(this.url);
  }

  ObtenerPorNombre(filtro:string): Observable<Medicos[]>{
    const httpOptions = {headers: new HttpHeaders({"content-type":"application/json"})}
    return this.http.get<Medicos[]>(this.url+"/PorNombre/"+filtro, httpOptions).pipe(retry(1),catchError((err)=>{

      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
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

  ObtenerTotal(filtro: string, busqueda:string, total: boolean): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<number>(this.url+"/Total/"+filtro+"/"+busqueda+"/"+total, httpOptions).pipe(retry(1),catchError((err)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  AgregarMedico(medico: Medicos): Observable<Medicos>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Medicos>("http://sistemamedico.somee.com/api/Medicos/AgregarMedico", medico, httpOptions).pipe(retry(1),catchError((err)=>{

      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ModificarMedico(medico: Medicos)
  {
    const httpOptions = {headers: new HttpHeaders({'Content-type':'application/json'})}
    return this.http.put<Medicos>(this.url, medico, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  BorrarMedico(idMedico: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({'Content-type':'application/json'})};
    return this.http.delete<number>(this.url+"?id="+idMedico, httpOptions).pipe(retry(1),catchError((error: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }
}
