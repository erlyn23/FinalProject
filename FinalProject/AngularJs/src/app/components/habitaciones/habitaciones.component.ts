import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Habitaciones } from 'src/app/Models/Habitaciones';
import { HabDialogComponent } from 'src/app/components/hab-dialog/hab-dialog.component';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  todasHabitaciones: Habitaciones[];
  comprobar: boolean = false;
  fg: FormGroup;
  decimalpatron = '^[0-9]{1,4}(\.[0-9][0-9])?$';

  constructor(private hs: HabitacionesService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fg = this.fb.group({
      NoHabitacion: ["",[Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      Tipo: ["",[Validators.required]],
      PrecioxDia: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(this.decimalpatron), Validators.max(9999.99)]]
    });
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(){
    this.hs.ObtenerHabitaciones().subscribe((data:any)=>{
      return this.todasHabitaciones = data;
    });
  }

  addHabitacion()
  {
    let hab = new Habitaciones();
    hab.Numero = this.fg.value.NoHabitacion;
    hab.Tipo = this.fg.value.Tipo;
    hab.PrecioxDia = this.fg.value.PrecioxDia;

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
    const dialogRef = this.dialog.open(HabDialogComponent,{
      width:'350px',
      data: 'Confirmar',
    });
    const idHab = this.todasHabitaciones[i].idHabitacion;

    dialogRef.afterClosed().subscribe(salida=>{
      if(salida){
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

  get NoHabitacion(){
    return this.fg.get('NoHabitacion');
  }

  get Tipo(){
    return this.fg.get('Tipo');
  }

  get PrecioxDia(){
    return this.fg.get('PrecioxDia');
  }

}
