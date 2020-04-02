import { Component, OnInit } from '@angular/core';
import { IngresosService } from 'src/app/services/ingresos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Habitaciones } from 'src/app/Models/Habitaciones';
import { Pacientes } from 'src/app/Models/Pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { IngresoArreglado } from 'src/app/Models/IngresoArreglado';
import { Ingresos } from 'src/app/Models/Ingresos';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {

  todasHabitaciones: Habitaciones[];
  todosPacientes: Pacientes[];
  todosIngresos: IngresoArreglado[];
  FechaDefecto: Date;
  fg: FormGroup;
  errorMessage: any;

  constructor(private is: IngresosService,
    private ps: PacientesService,
    private hs: HabitacionesService,
    private fb:FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.FechaDefecto = new Date();
    this.fg = this.fb.group({
      NombrePaciente: ["",[Validators.required]],
      NoHabitacion: ["",[Validators.required]],
      Fecha: [this.FechaDefecto,[Validators.required]]
    });
    this.obtenerIngresos();
    this.obtenerPacientes();
    this.obtenerHabitaciones();
  }

  obtenerIngresos(){
    this.is.ObtenerIngresos().subscribe((data:any)=>{
      return this.todosIngresos = data;
    });
  }

  obtenerHabitaciones(){
    this.hs.ObtenerHabitaciones().subscribe((data:any)=>{
      return this.todasHabitaciones = data;
    });
  }

  obtenerPacientes(){
    this.ps.ObtenerPacientes().subscribe((data:any)=>{
      return this.todosPacientes = data;
    });
  }
  addIngreso(){
    let ingreso = new Ingresos();
    ingreso.FechaIngreso = this.fg.value.Fecha;
    ingreso.idHabitacion = this.todasHabitaciones[this.fg.value.NoHabitacion].idHabitacion;
    ingreso.idPaciente = this.todosPacientes[this.fg.value.NombrePaciente].idPaciente;
    ingreso.FechaIngreso = this.fg.value.Fecha;
    let hab = this.todasHabitaciones[this.fg.value.NoHabitacion].Disponible;

    if(hab == 0)
    {
      this.errorMessage = "Esta habitación está ocupada, intente con una nueva";
    }
    else
    {
      this.errorMessage = "";
      this.is.AgregarIngreso(ingreso).subscribe(()=>{
        this.todosIngresos = [];
        this.obtenerIngresos();
        this.snack.open('Ingreso registrado correctamente', '',{
          duration:3000,
        });
        this.fg.controls.NombrePaciente.setValue("");
        this.fg.controls.NoHabitacion.setValue("");
        this.fg.value.Fecha = this.FechaDefecto;
      });
    }
  }

  get NombrePaciente(){
    return this.fg.get('NombrePaciente');
  }

  get NoHabitacion(){
    return this.fg.get('NoHabitacion');
  }

  get Fecha(){
    return this.fg.get('Fecha');
  }

}
