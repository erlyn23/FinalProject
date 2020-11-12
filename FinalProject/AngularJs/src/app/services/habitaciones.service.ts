import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Habitaciones } from '../Models/Habitaciones';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Opciones } from '../Models/Opciones';
import { MatDialog } from '@angular/material';
import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  url = environment.urls.Habitaciones;
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ObtenerHabitaciones(): Observable<Habitaciones[]>{
    return this.http.get<Habitaciones[]>(this.url).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorTipo(tip:string):Observable<Habitaciones[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Habitaciones[]>(this.url+"/PorTipo/"+tip, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  ObtenerOpciones(filtro: string, busqueda:string, total: boolean, suma: boolean, promedio: boolean, minimo:boolean, maximo: boolean):Observable<Opciones>
  {
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<Opciones>(this.url+"/Opciones/"+filtro+"/"+busqueda+"/"+total+"/"+suma+"/"+promedio+"/"+minimo+"/"+maximo, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  AgregarHabitacion(habitacion: Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Habitaciones>(this.url+"/AgregarHabitacion", habitacion, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  ModificarHabitacion(habitacion:Habitaciones): Observable<Habitaciones>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.put<Habitaciones>(this.url, habitacion, httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  EliminarHabitacion(id: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id,httpOptions).pipe(retry(1), catchError((error:HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }
}
