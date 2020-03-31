import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Citas } from '../Models/Citas';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { CitaArreglada } from '../Models/CitaArreglada';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  url = "https://localhost:44347/api/Citas";
  constructor(private http: HttpClient) { }

  ObtenerCitas(): Observable<CitaArreglada[]>
  {
    return this.http.get<CitaArreglada[]>(this.url);
  }

  AgregarCita(citas: Citas):Observable<Citas>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<Citas>(this.url, citas, httpOptions);
  }

  BorrarCita(id: string, tipo:string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions);
  }
}
