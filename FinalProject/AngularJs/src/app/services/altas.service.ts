import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AltaMedicaArreglada } from '../Models/AltaMedicaArreglada';
import { AltaMedica } from '../Models/AltaMedica';
import {throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AltasService {

  url = "https://localhost:44347/api/AltaMedica";
  constructor(private http: HttpClient) { }

  ObtenerAltasMedicas():Observable<AltaMedicaArreglada[]>{
    return this.http.get<AltaMedicaArreglada[]>(this.url).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  AgregarAltaMedica(alta:AltaMedica):Observable<AltaMedica>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<AltaMedica>(this.url,alta, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }

  EliminarAltaMedica(id: string, tipo:string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions).pipe(retry(1), catchError((err: HttpErrorResponse)=>{
      alert(err.error.Message);
      return throwError(err.error.Message);
    }));
  }
}
