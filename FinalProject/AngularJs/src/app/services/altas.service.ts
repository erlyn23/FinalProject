import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AltaMedicaArreglada } from '../Models/AltaMedicaArreglada';
import { AltaMedica } from '../Models/AltaMedica';

@Injectable({
  providedIn: 'root'
})
export class AltasService {

  url = "https://localhost:44347/api/AltasMedicas";
  constructor(private http: HttpClient) { }

  ObtenerAltasMedicas():Observable<AltaMedicaArreglada[]>{
    return this.http.get<AltaMedicaArreglada[]>(this.url);
  }

  AgregarAltaMedica(alta:AltaMedica):Observable<AltaMedica>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.post<AltaMedica>(this.url,alta, httpOptions);
  }

  EliminarAltaMedica(id: string, tipo:string): Observable<number>{
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id+"&tipo="+tipo, httpOptions);
  }
}
