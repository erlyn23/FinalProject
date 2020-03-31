import { Component, OnInit } from '@angular/core';
import { IngresosService } from 'src/app/services/ingresos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IngresoArreglado } from 'src/app/Models/IngresoArreglado';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { AltasService } from 'src/app/services/altas.service';
import { Pacientes } from 'src/app/Models/Pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';
import { AltaMedicaArreglada } from 'src/app/Models/AltaMedicaArreglada';
import { Habitaciones } from 'src/app/Models/Habitaciones';

@Component({
  selector: 'app-altas',
  templateUrl: './altas.component.html',
  styleUrls: ['./altas.component.css']
})
export class AltasComponent implements OnInit {

  todosIngresos: IngresoArreglado[];
  todasAltasMedicas: AltaMedicaArreglada[];
  todosPacientes: Pacientes[];
  todasHabitaciones: Habitaciones[];
  busqueda: any;
  fg: FormGroup;

  constructor(private is:IngresosService, 
    private hs: HabitacionesService,
    private as: AltasService,
    private ps: PacientesService,
    private fb:FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.fg = this.fb.group({
      idIngresos: [""],
    });

    this.obtenerAltasMedicas();
    this.obtenerPacientes();
    this.obtenerHabitaciones();
    this.obtenerIngresos();
  }

  obtenerIngresos(){
    this.is.ObtenerIngresos().subscribe((data:any)=>{
      return this.todosIngresos = data;
    });
  }

  obtenerAltasMedicas(){
    this.as.ObtenerAltasMedicas().subscribe((data:any)=>{
      return this.todasAltasMedicas = data;
    });
  }

  obtenerPacientes(){
    this.ps.ObtenerPacientes().subscribe((data:any)=>{
      return this.todosPacientes = data;
    });
  }

  obtenerHabitaciones(){
    this.hs.ObtenerHabitaciones().subscribe((data:any)=>{
      return this.todasHabitaciones = data;
    });
  }

  buscarIngreso(val)
  {
    this.busqueda = this.todosIngresos[val];
  }
}
