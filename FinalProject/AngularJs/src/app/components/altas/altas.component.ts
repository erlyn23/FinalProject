import { Component, OnInit } from '@angular/core';
import { IngresosService } from 'src/app/services/ingresos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IngresoArreglado } from 'src/app/Models/IngresoArreglado';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { AltasService } from 'src/app/services/altas.service';
import { Pacientes } from 'src/app/Models/Pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';
import { AltaMedicaArreglada } from 'src/app/Models/AltaMedicaArreglada';
import { Habitaciones } from 'src/app/Models/Habitaciones';
import { Ingresos } from 'src/app/Models/Ingresos';
import { AltaMedica } from 'src/app/Models/AltaMedica';

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
  Monto: any;
  errorMessage: any;
  fg: FormGroup;

  constructor(private is:IngresosService, 
    private hs: HabitacionesService,
    private as: AltasService,
    private ps: PacientesService,
    private fb:FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.fg = this.fb.group({
      idIngresos: ["", [Validators.required]], 
      NombrePaciente: ["",[Validators.required]],
      NoHabitacion: ["",[Validators.required]],
      FechaIngreso:["", [Validators.required]],
      FechaSalida: ["",[Validators.required]],
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
    this.fg.controls.NombrePaciente.setValue(this.busqueda.NombrePaciente);
    this.fg.controls.NoHabitacion.setValue(this.busqueda.NoHabitacion);
    this.fg.controls.FechaIngreso.setValue(this.busqueda.FechaIngreso);
  }

  CalcularMonto(){
    let fechita1 = new Date(this.fg.value.FechaIngreso);
    let fechita2 = new Date(this.fg.value.FechaSalida);
    let precioXdia = this.todasHabitaciones[this.fg.value.NoHabitacion].PrecioxDia;
    let diastranscurridos = (fechita2.getTime() - fechita1.getTime())/(1000*60*60*24);

    if(fechita2 < fechita1)
    {
      this.errorMessage = "La fecha de salida debe ser mayor a la fecha de ingreso";
    }
    else
    {
      this.errorMessage = "";
      this.Monto = precioXdia * diastranscurridos;
      let alta = new AltaMedica();
      alta.idIngreso = this.todosIngresos[this.fg.value.idIngresos].idIngreso;
      alta.idHabitacion = this.todasHabitaciones[this.fg.value.NoHabitacion].idHabitacion;
      alta.idPaciente = this.todosPacientes[this.fg.value.NombrePaciente].idPaciente;
      alta.FechaSalida = this.fg.value.FechaSalida;
      alta.Monto = this.Monto;
      console.log(alta);
      /*this.as.AgregarAltaMedica(alta).subscribe(()=>{
        this.todasAltasMedicas = [];
        this.obtenerAltasMedicas();
        this.snack.open('Alta médica dada correctamente', '',{
          duration: 3000
        });
      });*/
    }
  }


  get idIngresos(){
    return this.fg.get('idIngresos');
  }
  get NombrePaciente(){
    return this.fg.get('NombrePaciente');
  }
  get NoHabitacion(){
    return this.fg.get('NoHabitacion');
  }
  get FechaIngreso(){
    return this.fg.get('FechaIngreso');
  }
  get FechaSalida(){
    return this.fg.get('FechaSalida');
  }
}
