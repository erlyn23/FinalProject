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
  todosIngresos2: Ingresos[];
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
      Paciente: ["",[Validators.required]],
      NumeroHab: ["",[Validators.required]],
      FechaIngreso:["", [Validators.required]],
      FechaSalida: ["",[Validators.required]],
    });

    this.obtenerAltasMedicas();
    this.obtenerPacientes();
    this.obtenerHabitaciones();
    this.obtenerIngresos();
    this.obtenerIngresos2();
  }

  obtenerIngresos(){
    this.is.ObtenerIngresos().subscribe((data:any)=>{
      return this.todosIngresos = data;
    });
  }

  obtenerIngresos2(){
    this.is.ObtenerIngresos2().subscribe((data:any)=>{
      return this.todosIngresos2 = data;
    })
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
    this.fg.controls.Paciente.setValue(this.busqueda.NombrePaciente);
    this.fg.controls.NumeroHab.setValue(this.busqueda.NumeroHabitacion);
    this.fg.controls.FechaIngreso.setValue(this.busqueda.FechaIngreso);
  }
  registrarAltaMedica(){
    let fechita1 = new Date(this.fg.value.FechaIngreso);
    let fechita2 = new Date(this.fg.value.FechaSalida);
    let precioXdia;
    let Habitacion;
    let Paciente;

    //Aquí yo obtengo la habitación extraida del array Habitaciones.
    for(let i in this.todasHabitaciones){
      if(this.fg.value.NumeroHab == this.todasHabitaciones[i].Numero){
        precioXdia = this.todasHabitaciones[i].PrecioxDia; 
        Habitacion = this.todasHabitaciones[i].idHabitacion;
      }
    }

    //Aquí obtengo el Id del paciente extraído del array Ingresos.
    for(let i in this.todosIngresos2){
      if(this.busqueda.idIngreso == this.todosIngresos[i].idIngreso){
        Paciente = this.todosIngresos2[i].idPaciente;
      }
    }

    let diastranscurridos = (fechita2.getTime() - fechita1.getTime())/(1000*60*60*24);

    console.log(precioXdia, Paciente, Habitacion);
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
      alta.idHabitacion = Habitacion;
      alta.idPaciente = Paciente;
      alta.FechaSalida = this.fg.value.FechaSalida;
      alta.Monto = this.Monto;
      this.as.AgregarAltaMedica(alta).subscribe(()=>{
        this.todasAltasMedicas = [];
        this.obtenerAltasMedicas();
        this.snack.open('Alta médica dada correctamente (se eliminó el ingreso y se desocupó la habitación)', '',{
          duration: 3000
        });
      });
    }
  }


  get idIngresos(){
    return this.fg.get('idIngresos');
  }
  get Paciente(){
    return this.fg.get('Paciente');
  }
  get NumeroHab(){
    return this.fg.get('NumeroHab');
  }
  get FechaIngreso(){
    return this.fg.get('FechaIngreso');
  }
  get FechaSalida(){
    return this.fg.get('FechaSalida');
  }
}
