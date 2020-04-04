import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Opciones } from 'src/app/Models/Opciones';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import htmlToImage from 'html-to-image';

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
  comprobar:boolean = false;
  Monto: any;
  actual: any;
  opc: Opciones;
  errorMessage: any;
  fg: FormGroup;
  esFecha: boolean = false;
  busquedas: FormGroup;

  constructor(private is:IngresosService, 
    private hs: HabitacionesService,
    private as: AltasService,
    private ps: PacientesService,
    private fb:FormBuilder,
    private fb2: FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.actual = new Date();
    this.fg = this.fb.group({
      idIngresos: ["", [Validators.required]], 
      Paciente: ["",[Validators.required]],
      NumeroHab: ["",[Validators.required]],
      FechaIngreso:["", [Validators.required]],
      FechaSalida: [this.actual,[Validators.required]],
    });
    this.busquedas = this.fb2.group({
      Filtro: [""],
      Busqueda:[""],
      FechaBusqueda:[""],
      Total: false,
      Suma: false,
      Promedio: false,
      Mayor: false,
      Menor: false,
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
    this.opc = null;
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

    let total = this.busquedas.value.Total;
    let suma = this.busquedas.value.Suma;
    let promedio = this.busquedas.value.Promedio;
    let minimo = this.busquedas.value.Menor;
    let maximo = this.busquedas.value.Mayor;

    console.log(total,suma,promedio,minimo,maximo);
    if(this.busquedas.value.Filtro == "Paciente" && this.busquedas.value.Busqueda != ""){
      if(total == true || suma == true || promedio == true || minimo == true || maximo == true){
        this.as.ObtenerOpciones(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, total, suma, promedio, minimo, maximo).subscribe((data:any)=>{
          this.opc = data;
          console.log(data);
        });
      }else{
        this.opc = null;
      }
      this.as.ObtenerPorPaciente(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todasAltasMedicas = data;
      });
    }else if(this.busquedas.value.Filtro == "Fecha" && fechacompleta != ""){
      if(total == true || suma == true || promedio == true || minimo == true || maximo == true){
        this.as.ObtenerOpciones(this.busquedas.value.Filtro, fechacompleta, total, suma, promedio, minimo, maximo).subscribe((data:any)=>{
          this.opc = data;
        });
      }else{
        this.opc = null;
      }
      this.as.ObtenerPorFecha(fechacompleta).subscribe((data:any)=>{
        this.todasAltasMedicas = data;
      });
    }else if(this.busquedas.value.Filtro != "" && (this.busquedas.value.Busqueda == "" || fechacompleta == "")) {
      this.opc = null;
      this.obtenerAltasMedicas();
    }

  }

  buscarIngreso(val)
  {
    this.busqueda = this.todosIngresos[val];
    if(this.busqueda != undefined)
    {
      this.fg.controls.Paciente.setValue(this.busqueda.NombrePaciente);
      this.fg.controls.NumeroHab.setValue(this.busqueda.NumeroHabitacion);
      this.fg.controls.FechaIngreso.setValue(this.busqueda.FechaIngreso);
    }
  }

  CalcularMonto(){
    let fechita1 = new Date(this.fg.value.FechaIngreso);
    let fechita2 = new Date(this.fg.value.FechaSalida);
    let Habitacion = new Habitaciones();
    let Paciente;

    for(let i in this.todasHabitaciones){
      if(this.fg.value.NumeroHab == this.todasHabitaciones[i].Numero){
        Habitacion.PrecioxDia = this.todasHabitaciones[i].PrecioxDia; 
      }
    }

    for(let i in this.todosIngresos){
      if(this.busqueda.idIngreso == this.todosIngresos[i].idIngreso){
        Paciente = this.todosIngresos[i].idPaciente;
      }
    }

    let diastranscurridos = (fechita2.getTime() - fechita1.getTime())/(1000*60*60*24);
    if(fechita2 < fechita1)
    {
      this.errorMessage = "La fecha de salida debe ser mayor a la fecha de ingreso";
    }
    else
    {
      this.errorMessage = "";
      this.Monto = Habitacion.PrecioxDia * diastranscurridos;
      this.comprobar = true;
    }
  }

  addAlta(){
    let Habitacion = new Habitaciones();
    let Paciente;

    //Aquí yo obtengo la habitación extraida del array Habitaciones.
    for(let i in this.todasHabitaciones){
      if(this.fg.value.NumeroHab == this.todasHabitaciones[i].Numero){
        Habitacion.PrecioxDia = this.todasHabitaciones[i].PrecioxDia; 
        Habitacion.idHabitacion = this.todasHabitaciones[i].idHabitacion;
      }
    }

    //Aquí obtengo el Id del paciente extraído del array Ingresos.
    for(let i in this.todosIngresos){
      if(this.busqueda.idIngreso == this.todosIngresos[i].idIngreso){
        Paciente = this.todosIngresos[i].idPaciente;
      }
    }
      let alta = new AltaMedica();
      alta.idIngreso = this.todosIngresos[this.fg.value.idIngresos].idIngreso;
      alta.idHabitacion = Habitacion.idHabitacion;
      alta.idPaciente = Paciente;
      alta.FechaSalida = this.fg.value.FechaSalida;
      alta.Monto = this.Monto;
      alta.FechaIngreso = this.fg.value.FechaIngreso;
      this.as.AgregarAltaMedica(alta).subscribe(()=>{
        this.todasAltasMedicas = [];
        this.obtenerAltasMedicas();
        this.snack.open('Alta médica dada correctamente (se desocupó la habitación)', '',{
          duration: 3000
        });
        this.todosIngresos = [];
        this.obtenerIngresos();
        this.fg.controls.idIngresos.setValue("");
        this.fg.controls.Paciente.setValue("");
        this.fg.controls.NumeroHab.setValue("");
        this.fg.controls.FechaIngreso.setValue("");
        this.comprobar = false;
      });
  }

  capturar(){
    this.snack.open('Espere mientras se descarga el archivo', '',{
      duration: 3000,
    })
    htmlToImage.toPng(document.getElementById('paraImprimir'))
    .then(function (dataUrl) {
      let pdf = new jspdf('p','cm','a4');
      pdf.addImage(dataUrl, 'png',0, 0, 20.0, 10.0);
      pdf.save("ReporteAltaMedica.pdf");
    });
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

  get Suma(){
    return this.busquedas.get('Suma');
  }

  get Promedio(){
    return this.busquedas.get('Promedio');
  }

  get Mayor(){
    return this.busquedas.get('Mayor');
  }

  get Menor(){
    return this.busquedas.get('Menor');
  }
}
