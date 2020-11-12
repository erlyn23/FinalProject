import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresoArreglado } from '../Models/IngresoArreglado';
import { Ingresos } from '../Models/Ingresos';
import {retry, catchError} from 'rxjs/operators';
import {throwError }from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  url = environment.urls.Ingresos;
  constructor(private http: HttpClient, private dialog:MatDialog) { }

  ObtenerIngresos(): Observable<IngresoArreglado[]>{
    return this.http.get<IngresoArreglado[]>(this.url).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ObtenerIngresos2():Observable<Ingresos[]>{
    return this.http.get<Ingresos[]>(this.url+"/Ingresos2").pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ObtenerPorHabitacion(hab:string): Observable<IngresoArreglado[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<IngresoArreglado[]>(this.url+"/PorHabitacion/"+hab, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ObtenerPorFecha(fecha:string): Observable<IngresoArreglado[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<IngresoArreglado[]>(this.url+"/PorFecha/"+fecha, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ObtenerTotal(filtro:string, busqueda:string, total:boolean):Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<number>(this.url+"/Total/"+filtro+"/"+busqueda+"/"+total, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }


  AgregarIngreso(ingreso:Ingresos): Observable<Ingresos>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Ingresos>(this.url+"/AgregarIngreso", ingreso, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  EliminarIngreso(id: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }
}
