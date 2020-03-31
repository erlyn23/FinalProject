import { Component, OnInit } from '@angular/core';
import { IngresosService } from 'src/app/services/ingresos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IngresoArreglado } from 'src/app/Models/IngresoArreglado';

@Component({
  selector: 'app-altas',
  templateUrl: './altas.component.html',
  styleUrls: ['./altas.component.css']
})
export class AltasComponent implements OnInit {

  todosIngresos: IngresoArreglado[];
  busqueda: any;
  fg: FormGroup;

  constructor(private is:IngresosService, 
    private fb:FormBuilder,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.fg = this.fb.group({
      idIngresos: [""],
    });

    this.obtenerIngresos();
  }

  obtenerIngresos(){
    this.is.ObtenerIngresos().subscribe((data:any)=>{
      return this.todosIngresos = data;
    });
  }

  buscarIngreso(val)
  {
    this.busqueda = this.todosIngresos[val];
  }
}
