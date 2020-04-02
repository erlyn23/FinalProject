import { Component, OnInit } from '@angular/core';
import { PacientesService } from 'src/app/services/pacientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Pacientes } from 'src/app/Models/Pacientes';
import { DialogComponent } from '../dialog/dialog.component';
import { CitasService } from 'src/app/services/citas.service';
import { AltasService } from 'src/app/services/altas.service';
import { IngresosService } from 'src/app/services/ingresos.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  todosPacientes: Pacientes[];
  fg: FormGroup;
  comprobar: boolean = false;

  constructor(private ps: PacientesService, 
    private as: AltasService,
    private is: IngresosService,
    private fb: FormBuilder, 
    private snack: MatSnackBar, 
    private dialog:MatDialog,
    private dc: DialogComponent,
    private cs: CitasService) { }

  ngOnInit() {
    this.fg = this.fb.group({
      Cedula: ["",[Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]*')]],
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Asegurado: ["",[Validators.required]]
    });
    this.obtenerPacientes();
  }

  obtenerPacientes(){
    this.ps.ObtenerPacientes().subscribe(data=>{
      return this.todosPacientes = data;
    });
  }

  addPaciente(paciente: Pacientes){
    paciente = new Pacientes();
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

  modificarPaciente(paciente: Pacientes)
  {
    paciente = new Pacientes();
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
        this.as.EliminarAltaMedica(idPac.toString(), "Paciente").subscribe(()=>{
          this.todosPacientes = [];
          this.obtenerPacientes();
        });
        this.is.EliminarIngreso(idPac.toString(), "Paciente").subscribe(()=>{
          this.todosPacientes= [];
          this.obtenerPacientes();
        });
        this.cs.BorrarCita(idPac.toString(), "Paciente").subscribe(()=>{
            {
            this.todosPacientes =[];
            this.obtenerPacientes();
          }  
        })
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

  get Cedula(){
    return this.fg.get('Cedula');
  }

  get Nombre(){
    return this.fg.get('Nombre');
  }

  get Asegurado(){
    return this.fg.get('Asegurado');
  }

}
