import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MedicosService } from 'src/app/services/medicos.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { CitasService } from 'src/app/services/citas.service';
import { IngresosService } from 'src/app/services/ingresos.service';
import { AltasService } from 'src/app/services/altas.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.css']
})

export class DialogErrorComponent implements OnInit {

  mensaje:string;
  constructor(private dialogRef: MatDialogRef<DialogErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
    this.mensaje = this.message;
  }
}
