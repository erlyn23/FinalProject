import { Component, OnInit } from '@angular/core';
import { PacientesService } from 'src/app/services/pacientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Pacientes } from 'src/app/Models/Pacientes';
import { DialogComponent } from '../dialog/dialog.component';
import * as jspdf from 'jspdf';
import htmlToImage from 'html-to-image';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  todosPacientes: Pacientes[];
  busquedas: FormGroup;
  fg: FormGroup;
  totalPacientes: any;
  esAsegurado: boolean = false;
  comprobar: boolean = false;
  cargando: boolean = false;

  constructor(private ps: PacientesService, 
    private fb: FormBuilder, 
    private fb2: FormBuilder,
    private snack: MatSnackBar, 
    private dialog:MatDialog) { }

  ngOnInit() {
    this.fg = this.fb.group({
      Cedula: ["",[Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]*')]],
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Asegurado: ["",[Validators.required]]
    });
    this.busquedas = this.fb2.group({
      Filtro: [""],
      Busqueda: [""],
      Asegurado: [""],
      Total: false,
    })
    this.obtenerPacientes();
  }

  obtenerPacientes(){
    this.totalPacientes = null;
    this.ps.ObtenerPacientes().subscribe(data=>{
      return this.todosPacientes = data;
    });
  }

  cambiarControl(val){
    if(val == "Asegurados"){
      this.esAsegurado = true;
    }else{
      this.esAsegurado = false;
    }
  }

  Search(){
    if(this.busquedas.value.Filtro == "Cedula" && this.busquedas.value.Busqueda != ""){
      if(this.busquedas.value.Total == true){
        this.ps.ObtenerTotal(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalPacientes = data;
        });
      }else{
        this.totalPacientes = null;
      }
      this.ps.ObtenerPorCedula(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todosPacientes = data;
      });
    }else if(this.busquedas.value.Filtro == "Nombre" && this.busquedas.value.Busqueda != ""){
      if(this.busquedas.value.Total == true){
        this.ps.ObtenerTotal(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalPacientes = data;
        });
      }else{
        this.totalPacientes = null;
      }
      this.ps.ObtenerPorNombre(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todosPacientes = data;
      });
    }else if(this.busquedas.value.Filtro != "" && (this.busquedas.value.Busqueda == "" || this.busquedas.value.Asegurado =="")){
      this.totalPacientes = null;
      this.obtenerPacientes();
    }
  }

  filtroEspecial(val){
    if(this.busquedas.value.Total == true){
      this.ps.ObtenerTotal(this.busquedas.value.Filtro, val, this.busquedas.value.Total).subscribe((data:any)=>{
        this.totalPacientes = data;
      });
    }else{
      this.totalPacientes = null;
    }
      this.ps.ObtenerPorAsegurado(val).subscribe((data:any)=>{
        this.todosPacientes = data;
      });
  }

  addPaciente(){
    let paciente = new Pacientes();
    paciente.Cedula = this.fg.value.Cedula;
    paciente.Nombre = this.fg.value.Nombre;
    paciente.Asegurado = this.fg.value.Asegurado;

    this.ps.AgregarPaciente(paciente).subscribe(()=>{
      this.snack.open('Paciente registrado correctamente', '',{
        duration: 3000,
      });
      this.todosPacientes =[];
      this.obtenerPacientes();
      this.fg.reset();
    })
  }

  index: number;
  rellenarDatos(i:number){
    this.fg.controls.Cedula.setValue(this.todosPacientes[i].Cedula); 
    this.fg.controls.Nombre.setValue(this.todosPacientes[i].Nombre);
    this.fg.controls.Asegurado.setValue(this.todosPacientes[i].Asegurado);
    this.index = i;
    this.comprobar = true;
  }

  modificarPaciente()
  {
    let paciente = new Pacientes();
    paciente.idPaciente = this.todosPacientes[this.index].idPaciente;
    paciente.Cedula = this.fg.value.Cedula;
    paciente.Nombre = this.fg.value.Nombre;
    paciente.Asegurado = this.fg.value.Asegurado;

    this.ps.ModificarPaciente(paciente).subscribe(()=>{
        
        this.todosPacientes = [];
        this.obtenerPacientes();
        this.snack.open('Paciente modificado correctamente', '',{
          duration: 3000,
        });
        this.fg.reset();
        this.comprobar = false;
    });
  }

  deletePaciente(i:number)
  {
    const dialogRef = this.dialog.open(DialogComponent,
      {
        width: '350px',
        data: 'Confirmar',
      });

    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        const idPac = this.todosPacientes[i].idPaciente;
        this.ps.EliminarPaciente(idPac.toString()).subscribe(()=>
        {  
          this.todosPacientes = [];
          this.obtenerPacientes();
          this.snack.open('Paciente eliminado correctamente', '',{
            duration: 3000,
          });
        });
      }
    })
  }

  capturar(){
    this.cargando = true;
    htmlToImage.toPng(document.getElementById('paraImprimir'))
    .then(function (dataUrl) {
      let pdf = new jspdf('p','cm','a4');
      pdf.addImage(dataUrl, 'png',0, 0, 20.0, 10.0);
      pdf.save("ReportePacientes.pdf");
    }).finally(()=>{
      this.cargando = false;
    });
  }

  get Cedula(){
    return this.fg.get('Cedula');
  }

  get Nombre(){
    return this.fg.get('Nombre');
  }

  get Asegurado(){
    return this.fg.get('Asegurado');
  }

  get Filtro(){
    return this.busquedas.get('Filtro');
  }

  get Asegurados(){
    return this.busquedas.get('Asegurados');
  }

  get Busqueda(){
    return this.busquedas.get('Busqueda');
  }

  get Total(){
    return this.busquedas.get('Total');
  }

}
