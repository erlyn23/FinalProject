import { Component, OnInit } from '@angular/core';
import { MedicosService } from 'src/app/services/medicos.service';
import { Medicos } from 'src/app/Models/Medicos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { Pacientes } from 'src/app/Models/Pacientes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { CitaArreglada } from 'src/app/Models/CitaArreglada';
import { Citas } from 'src/app/Models/Citas';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  todosMedicos: Medicos[];
  todosPacientes: Pacientes[];
  todasCitas: CitaArreglada[];

  fg: FormGroup;


  constructor(private ms: MedicosService,
    private ps: PacientesService,
    private cs: CitasService,
    private fb: FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.fg = this.fb.group({
      NombreMedico: ["",[Validators.required]],
      NombrePaciente: ["",[Validators.required]],
      Fecha: ["",[Validators.required]],
      Hora: ["",[Validators.required]]
    });

    this.obtenerMedicos();
    this.obtenerPacientes();
    this.obtenerCitas();
  }

  obtenerCitas(){
    this.cs.ObtenerCitas().subscribe((data:any)=>{
      return this.todasCitas = data;
    })
  }

  obtenerMedicos(){
    this.ms.ObtenerMedicos().subscribe((data:any)=>{
      return this.todosMedicos = data;
    });
  }

  obtenerPacientes(){
     this.ps.ObtenerPacientes().subscribe((data:any)=>{
      return this.todosPacientes = data; 
    });
  }


  addCita()
  {
    let cita = new Citas();
    const idMedico = this.todosMedicos[this.fg.value.NombreMedico].idMedico;
    const idPaciente = this.todosPacientes[this.fg.value.NombrePaciente].idPaciente;

    cita.idMedico = idMedico;
    cita.idPaciente = idPaciente;
    cita.Fecha = this.fg.value.Fecha;
    cita.Hora = this.fg.value.Hora;

    this.cs.AgregarCita(cita).subscribe(()=>{
      this.snack.open('Cita agendada correctamente', '',{
        duration: 3000,
      });
      this.todasCitas = [];
      this.obtenerCitas();
      this.fg.reset();
    });
  }



  get NombreMedico(){
    return this.fg.get('NombreMedico');
  }

  get NombrePaciente(){
    return this.fg.get('NombrePaciente');
  }

  get Fecha(){
    return this.fg.get('Fecha');
  }

  get Hora(){
    return this.fg.get('Hora');
  }

}
