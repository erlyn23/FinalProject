import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresoArreglado } from '../Models/IngresoArreglado';
import { Ingresos } from '../Models/Ingresos';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  url = "https://localhost:44347/api/Ingresos"
  constructor(private http: HttpClient) { }

  ObtenerIngresos(): Observable<IngresoArreglado[]>{
    return this.http.get<IngresoArreglado[]>(this.url);
  }

  AgregarIngreso(ingreso:Ingresos): Observable<Ingresos>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Ingresos>(this.url, ingreso, httpOptions);
  }

  EliminarIngreso(id: string, tipo: string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions);
  }
}
