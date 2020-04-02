import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresoArreglado } from '../Models/IngresoArreglado';
import { Ingresos } from '../Models/Ingresos';
import {retry, catchError} from 'rxjs/operators';
import {throwError }from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  url = "https://localhost:44347/api/Ingresos"
  constructor(private http: HttpClient) { }

  ObtenerIngresos(): Observable<IngresoArreglado[]>{
    return this.http.get<IngresoArreglado[]>(this.url).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  ObtenerIngresos2():Observable<Ingresos[]>{
    return this.http.get<Ingresos[]>(this.url+"/Ingresos2").pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  AgregarIngreso(ingreso:Ingresos): Observable<Ingresos>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Ingresos>(this.url, ingreso, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  EliminarIngreso(id: string, tipo: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }
}
