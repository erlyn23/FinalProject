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
  esFecha: boolean = false;
  busquedas: FormGroup;
  totalIngresos: any;
  FechaDefecto: Date;
  fg: FormGroup;
  errorMessage: any;

  constructor(private is: IngresosService,
    private ps: PacientesService,
    private hs: HabitacionesService,
    private fb:FormBuilder,
    private fb2: FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.FechaDefecto = new Date();
    this.fg = this.fb.group({
      NombrePaciente: ["",[Validators.required]],
      NoHabitacion: ["",[Validators.required]],
      Fecha: [this.FechaDefecto,[Validators.required]]
    });

    this.busquedas = this.fb2.group({
      Filtro: [""],
      Busqueda:[""],
      FechaBusqueda:[""],
      Total: false,
    });
    this.obtenerIngresos();
    this.obtenerPacientes();
    this.obtenerHabitaciones();
  }

  obtenerIngresos(){
    this.totalIngresos = null;
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

  cambiarControl(val){
    if(val == "Fecha"){
      this.esFecha = true;
    }else{
      this.esFecha = false;
    }
  }

  Search(){
    let fechabuscada = new Date(this.busquedas.value.FechaBusqueda);
    let dia = fechabuscada.getDate();
    let mes = fechabuscada.getMonth();
    let año = fechabuscada.getFullYear();
    let fechacompleta = dia+"-"+(mes+1)+"-"+año;

    if(this.busquedas.value.Filtro == "Habitacion" && this.busquedas.value.Busqueda != ""){
      if(this.busquedas.value.Total == true){
        this.is.ObtenerTotal(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalIngresos = data;
        });
      }else{
        this.totalIngresos = null;
      }
      this.is.ObtenerPorHabitacion(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todosIngresos = data;
      });
    }else if(this.busquedas.value.Filtro == "Fecha" && fechacompleta != ""){
      if(this.busquedas.value.Total == true){
        this.is.ObtenerTotal(this.busquedas.value.Filtro, fechacompleta, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalIngresos = data;
        });
      }else{
        this.totalIngresos = null;
      }
      this.is.ObtenerPorFecha(fechacompleta).subscribe((data:any)=>{
        this.todosIngresos = data;
      });
    }else if(this.busquedas.value.Filtro != "" && (this.busquedas.value.Busqueda == "" || fechacompleta == "")) {
      this.totalIngresos = null;
      this.obtenerIngresos();
    }

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

  get Filtro(){
    return this.busquedas.get('Filtro');
  }

  get Busqueda(){
    return this.busquedas.get('Busqueda');
  }

  get FechaBusqueda(){
    return this.busquedas.get('FechaBusqueda');
  }

  get Total(){
    return this.busquedas.get('Total');
  }

}
