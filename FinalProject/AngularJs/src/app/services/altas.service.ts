import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AltaMedicaArreglada } from '../Models/AltaMedicaArreglada';
import { AltaMedica } from '../Models/AltaMedica';
import {throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import { Opciones } from '../Models/Opciones';
import { MatDialog } from '@angular/material';
import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';

@Injectable({
  providedIn: 'root'
})
export class AltasService {

  url = "http://sistemamedico.somee.com/api/AltaMedica";
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ObtenerAltasMedicas():Observable<AltaMedicaArreglada[]>{
    return this.http.get<AltaMedicaArreglada[]>(this.url).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: err.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(err.error.Message);
    }));
  }

  ObtenerPorPaciente(pac:string): Observable<AltaMedicaArreglada[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<AltaMedicaArreglada[]>(this.url+"/PorPaciente/"+pac, httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  ObtenerPorFecha(fecha:string): Observable<AltaMedicaArreglada[]>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.get<AltaMedicaArreglada[]>(this.url+"/PorFecha/"+fecha, httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
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

  AgregarAltaMedica(alta:AltaMedica):Observable<AltaMedica>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<AltaMedica>(this.url,alta, httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }

  EliminarAltaMedica(id: string, tipo:string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions).pipe(retry(1), catchError((error: HttpErrorResponse)=>{
      const dialogRef = this.dialog.open(DialogErrorComponent, {
        width: '350px',
        data: error.error.Message,
      });
      dialogRef.afterClosed().subscribe((response)=>{});
      return throwError(error.error.Message);
    }));
  }
}
