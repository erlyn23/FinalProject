import { Component, OnInit } from '@angular/core';
import { MedicosService } from 'src/app/services/medicos.service';
import { Medicos } from 'src/app/Models/Medicos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { Pacientes } from 'src/app/Models/Pacientes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { CitaArreglada } from 'src/app/Models/CitaArreglada';
import { Citas } from 'src/app/Models/Citas';
import { MatSnackBar, MatDialog } from '@angular/material';
import htmlToImage from 'html-to-image'
import * as jspdf from 'jspdf';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  todosMedicos: Medicos[];
  todosPacientes: Pacientes[];
  todasCitas: CitaArreglada[];
  totalCitas: any;
  busquedas: FormGroup;
  esFecha: boolean = false;
  cargando: boolean = false;

  fg: FormGroup;


  constructor(private ms: MedicosService,
    private ps: PacientesService,
    private cs: CitasService,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private snack: MatSnackBar,
    private errDialog: MatDialog) { }

  ngOnInit() {
    this.fg = this.fb.group({
      NombreMedico: ["",[Validators.required]],
      NombrePaciente: ["",[Validators.required]],
      Fecha: ["",[Validators.required]],
      Hora: ["",[Validators.required]]
    });

    this.busquedas = this.fb2.group({
      Filtro:[""],
      Busqueda:[""],
      FechaBusqueda: [""],
      Total: false,
    })

    this.obtenerMedicos();
    this.obtenerPacientes();
    this.obtenerCitas();
  }

  obtenerCitas(){
    this.totalCitas = null;
    this.cs.ObtenerCitas().subscribe((data:any)=>{
      return this.todasCitas = data;
    })
  }

  obtenerMedicos(){
    this.ms.ObtenerMedicos().subscribe((data:any)=>{
      return this.todosMedicos = data;
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

    if(this.busquedas.value.Filtro == "NombreMedico" && this.busquedas.value.Busqueda != ""){
      if(this.busquedas.value.Total == true){
        this.cs.ObtenerTotal(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalCitas = data;
        });
      }else{
        this.totalCitas = null;
      }
      this.cs.ObtenerPorMedico(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todasCitas = data;
      });
    }else if(this.busquedas.value.Filtro == "NombrePaciente" && this.busquedas.value.Busqueda != ""){
      if(this.busquedas.value.Total == true){
        this.cs.ObtenerTotal(this.busquedas.value.Filtro, this.busquedas.value.Busqueda, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalCitas = data;
        });
      }else{
        this.totalCitas = null;
      }
      this.cs.ObtenerPorPaciente(this.busquedas.value.Busqueda).subscribe((data:any)=>{
        this.todasCitas = data;
      });
    }else if(this.busquedas.value.Filtro == "Fecha" && fechacompleta != ""){
      if(this.busquedas.value.Total == true){
        this.cs.ObtenerTotal(this.busquedas.value.Filtro, fechacompleta, this.busquedas.value.Total).subscribe((data:any)=>{
          this.totalCitas = data;
        });
      }else{
        this.totalCitas = null;
      }
      this.cs.ObtenerPorFecha(fechacompleta).subscribe((data:any)=>{
        this.todasCitas = data;
      });
    }else if(this.busquedas.value.Filtro != "" && (this.busquedas.value.Busqueda == "" || fechacompleta == "")) {
      this.totalCitas = null;
      this.obtenerCitas();
    }
  }

  addCita()
  {
    let cita = new Citas();
    const idMedico = this.todosMedicos[this.fg.value.NombreMedico].idMedico;
    const idPaciente = this.todosPacientes[this.fg.value.NombrePaciente].idPaciente;
    let actual = new Date();

    cita.idMedico = idMedico;
    cita.idPaciente = idPaciente;
    cita.Fecha = this.fg.value.Fecha;
    cita.Hora = this.fg.value.Hora;

    if(new Date(cita.Fecha) < actual)
    {
      let dialogRef = this.errDialog.open(DialogErrorComponent,{
        width: '350px',
        data: 'Fecha pasada, elige una fecha mayor a la de hoy'
      });
      dialogRef.afterClosed().subscribe(()=>{});
    }else{
      this.cs.AgregarCita(cita).subscribe(()=>{
        this.snack.open('Cita agendada correctamente', '',{
          duration: 3000,
        });
        this.todasCitas = [];
        this.obtenerCitas();
        this.fg.reset();
      });
    }
  }

  deleteCita(i: number)
  {
    const idCita = this.todasCitas[i].IdCita;
    this.cs.BorrarCita(idCita.toString()).subscribe(()=>{
      this.todasCitas = [];
      this.obtenerCitas();
      this.snack.open('Cita eliminada correctamente', '',{
        duration:3000,
      })
    });
  }

  capturar(){
    
    this.cargando = true;
    htmlToImage.toPng(document.getElementById('paraImprimir'))
    .then(function (dataUrl) {
      let pdf = new jspdf('p','cm','a4');
      pdf.addImage(dataUrl, 'png',0, 0, 20.0, 10.0);
      pdf.save("ReporteCitas.pdf");
    }).finally(()=>{
      this.cargando = false;
    });
  }

  get NombreMedico(){
    return this.fg.get('NombreMedico');
  }

  get NombrePaciente(){
    return this.fg.get('NombrePaciente');
  }

  get Fecha(){
    return this.fg.get('Fecha');
  }

  get Hora(){
    return this.fg.get('Hora');
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
    return this.busquedas.get("Total");
  }

}
