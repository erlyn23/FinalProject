import { Injectable } from '@angular/core';
import { Medicos } from '../Models/Medicos';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  url = "https://localhost:44347/api/Medicos"
  constructor(private http: HttpClient) { }

  ObtenerMedicos(): Observable<Medicos[]>{
    return this.http.get<Medicos[]>(this.url);
  }

  AgregarMedico(medico: Medicos): Observable<Medicos>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Medicos>(this.url, medico, httpOptions);
  }

  /*ModificarMedico(id:string, medico: Medicos)
  {
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})}
    return this.http.put<Medicos>(this.url + "/ModificarMedico/"+id, medico, httpOptions);
  }*/
}
