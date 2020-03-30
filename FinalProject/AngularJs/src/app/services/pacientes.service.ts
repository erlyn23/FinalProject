import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pacientes } from '../Models/Pacientes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  url = "https://localhost:44347/Pacientes";
  constructor(private http: HttpClient) { }

  ObtenerPacientes(): Observable<Pacientes[]>
  {
    return this.http.get<Pacientes[]>(this.url);
  }

  AgregarPaciente(paciente:Pacientes): Observable<Pacientes>{
    const httpOptions = {headers: new HttpHeaders({"Content-type": "application/json"})};
    return this.http.post<Pacientes>(this.url,paciente,httpOptions);
  }

  ModificarPaciente(paciente:Pacientes): Observable<Pacientes>{
    const httpOptions = {headers: new HttpHeaders({"Content-type": "application/json"})};
    return this.http.put<Pacientes>(this.url, paciente, httpOptions);
  }

  EliminarPaciente(id: string): Observable<number>
  {
    const httpOptions = {headers: new HttpHeaders({"Content-type":"application/json"})};
    return this.http.delete<number>(this.url+"/?id="+id, httpOptions);
  }
}
