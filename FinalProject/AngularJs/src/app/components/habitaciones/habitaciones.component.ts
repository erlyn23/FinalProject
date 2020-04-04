import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Habitaciones } from 'src/app/Models/Habitaciones';
import { DialogComponent } from '../dialog/dialog.component';
import { IngresosService } from 'src/app/services/ingresos.service';
import { AltasService } from 'src/app/services/altas.service';
import { Opciones } from 'src/app/Models/Opciones';
import htmlToImage from 'html-to-image';
import * as jspdf from 'jspdf';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  todasHabitaciones: Habitaciones[];
  comprobar: boolean = false;
  busquedas: FormGroup;
  opc: Opciones;
  fg: FormGroup;
  decimalpatron = '^[0-9]{1,4}(\.[0-9][0-9])?$';
  cargando: boolean = false;

  constructor(private hs: HabitacionesService,
    private is: IngresosService,
    private as: AltasService,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private snack: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fg = this.fb.group({
      NoHabitacion: ["",[Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      Tipo: ["",[Validators.required]],
      PrecioxDia: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(this.decimalpatron), Validators.max(9999.99)]]
    });

    this.busquedas = this.fb2.group({
      Filtro: [""],
      Busqueda: [""],
      Total: false,
      Suma: false,
      Promedio: false,
      Mayor: false,
      Menor: false,
    });
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(){
    this.opc = null;
    this.hs.ObtenerHabitaciones().subscribe((data:any)=>{
      return this.todasHabitaciones = data;
    });
  }

  Search(){
    let total = this.busquedas.value.Total;
    let suma = this.busquedas.value.Suma;
    let promedio = this.busquedas.value.Promedio;
    let minimo = this.busquedas.value.Menor;
    let maximo = this.busquedas.value.Mayor;
    
    if(this.busquedas.value.Filtro == "Tipo" && this.busquedas.value.Busqueda != ""){
      if(total == true || suma == true || promedio == true || minimo == true || maximo == true){
        this.hs.ObtenerOpciones(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, total, suma, promedio, minimo, maximo).subscribe((data:any)=>{
          this.opc = data;
        });
      }
      else{
        this.opc = null;
      }
      this.hs.ObtenerPorTipo(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todasHabitaciones = data;
      });
    }else{
      this.opc = null;
      this.hs.ObtenerHabitaciones();
    }
  }

  addHabitacion()
  {
    let hab = new Habitaciones();
    hab.Numero = this.fg.value.NoHabitacion;
    hab.Tipo = this.fg.value.Tipo;
    hab.PrecioxDia = this.fg.value.PrecioxDia;

    if(hab.Tipo == "Doble"){
      hab.Disponible = 2;
    }
    else{
      hab.Disponible = 1;
    }
    this.hs.AgregarHabitacion(hab).subscribe(()=>{
      this.todasHabitaciones = [];
      this.obtenerHabitaciones();
      this.snack.open('Habitación agregada correctamente', '',{
        duration: 3000,
      });
      this.fg.reset();
    });
  }
  index: number;

  rellenarDatos(i:number)
  {
    this.fg.controls.NoHabitacion.setValue(this.todasHabitaciones[i].Numero);
    this.fg.controls.Tipo.setValue(this.todasHabitaciones[i].Tipo);
    this.fg.controls.PrecioxDia.setValue(this.todasHabitaciones[i].PrecioxDia);
    this.comprobar = true;
    this.index = i;
  }

  modificarHabitacion(){
    let hab = new Habitaciones();
    const idHabitacion = this.todasHabitaciones[this.index].idHabitacion;
    hab.idHabitacion = idHabitacion;
    hab.Numero = this.fg.value.NoHabitacion;
    hab.Tipo = this.fg.value.Tipo;
    hab.PrecioxDia = this.fg.value.PrecioxDia;

    this.hs.ModificarHabitacion(hab).subscribe(()=>{
      this.todasHabitaciones = [];
      this.obtenerHabitaciones();
      this.snack.open('Habitación modificada correctamente', '',{
        duration: 3000,
      });
      this.fg.reset();
    })
  }

  deleteHabitacion(i:number){
    const dialogRef = this.dialog.open(DialogComponent,{
      width:'350px',
      data: 'Confirmar',
    });
    const idHab = this.todasHabitaciones[i].idHabitacion;

    dialogRef.afterClosed().subscribe(salida=>{
      if(salida){
          this.as.EliminarAltaMedica(idHab.toString(),"Habitacion").subscribe(()=>{});
          this.is.EliminarIngreso(idHab.toString(), "Habitacion").subscribe(()=>{});
          this.hs.EliminarHabitacion(idHab.toString()).subscribe(()=>{
          this.todasHabitaciones = [];
          this.obtenerHabitaciones();
          this.snack.open('Habitación eliminada correctamente', '',{
            duration:3000,
          });
          this.fg.reset();
        })
      }
    })
  }
  capturar(){
    this.cargando = true;
    htmlToImage.toPng(document.getElementById('paraImprimir'))
    .then(function (dataUrl) {
      let pdf = new jspdf('p','cm','a4');
      pdf.addImage(dataUrl, 'png',0, 0, 20.0, 10.0);
      pdf.save("ReporteHabitaciones.pdf");
    }).finally(()=>{
      this.cargando = false;
    });
  }

  get NoHabitacion(){
    return this.fg.get('NoHabitacion');
  }

  get Tipo(){
    return this.fg.get('Tipo');
  }

  get PrecioxDia(){
    return this.fg.get('PrecioxDia');
  }

  get Filtro(){
    return this.busquedas.get('Filtro');
  }
  get Busqueda(){
    return this.busquedas.get('Busqueda');
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
