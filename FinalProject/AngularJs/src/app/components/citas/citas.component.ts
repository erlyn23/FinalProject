import { Component, OnInit } from '@angular/core';
import { MedicosService } from 'src/app/services/medicos.service';
import { Medicos } from 'src/app/Models/Medicos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { Pacientes } from 'src/app/Models/Pacientes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  todosMedicos: Medicos[];
  todosPacientes: Pacientes[];

  fg: FormGroup;


  constructor(private ms: MedicosService,
    private ps: PacientesService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.fg = this.fb.group({
      NombreMedico: ["",[Validators.required]],
      NombrePaciente: ["",[Validators.required]],
      Fecha: ["",[Validators.required]],
      Hora: ["",[Validators.required]]
    });

    this.obtenerMedicos();
    this.obtenerPacientes();
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
