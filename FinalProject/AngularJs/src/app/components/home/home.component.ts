import { Component, OnInit } from '@angular/core';
import { MedicosService } from 'src/app/services/medicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medicos } from 'src/app/Models/Medicos';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todosMedicos: any[];
  valor: any;
  Especialidades: any[] = ["Alergología",
    "Anestesiología",
    "Cardiología",
    "Gastroenterología",
    "Endocrinología",
    "Epidemiología",
    "Geriatría",
    "Hematología",
    "Infectología",
    "Medicina aeroespacial",
    "Medicina del deporte",
    "Medicina del trabajo",
    "Medicina de urgencias",
    "Medicina familiar y comunitaria",
    "Medicina física y rehabilitación",
    "Medicina intensiva",
    "Medicina interna",
    "Medicina forense",
    "Medicina preventiva y salud pública",
    "Nefrología",
    "Neumología",
    "Neurología",
    "Nutriología",
    "Oncología médica",
    "Oncología radioterápica",
    "Pediatría",
    "Psiquiatría",
    "Reumatología",
    "Toxicología",
    "Cirugía cardíaca",
    "Cirugía general",
    "Cirugía oral y maxilofacial",
    "Cirugía ortopédica",
    "Cirugía pediátrica",
    "Cirugía plástica",
    "Cirugía torácica",
    "Neurocirugía",
    "Angiología",
    "Dermatología",
    "Ginecología y obstetricia o tocología",
    "Oftalmología",
    "Otorrinolaringología",
    "Urología",
    "Traumatología",
    "Análisis clínico",
    "Anatomía patológica",
    "Bioquímica clínica",
    "Farmacología",
    "Genética médica",
    "Inmunología",
    "Medicina nuclear",
    "Microbiología y parasitología",
    "Neurofisiología clínica",
    "Radiología",
    "Odontología"];

    Columnas: string[] = ["No.", "Nombre", "Exequatur", "Especialidad"];

    medicos: any[];

    fg: FormGroup;
    id: number;
    comprobar: boolean = false;
  
  
    constructor(private fb: FormBuilder,
    private ms: MedicosService,
    private snack: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fg = this.fb.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Exequatur: ["", [Validators.required,Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      Especialidad: ["",[Validators.required]]
    });
    this.Especialidades.sort();
    this.obtenerMedicos();
  }

  obtenerMedicos(){
    this.ms.ObtenerMedicos().subscribe((data:any)=>
    {
      return this.todosMedicos = data;
    });
  }

  addMedico(medico: Medicos)
  {
    medico = new Medicos();
    
    medico.Nombre = this.fg.value.Nombre;
    medico.Exequatur = this.fg.value.Exequatur;
    medico.Especialidad = this.fg.value.Especialidad;
    this.ms.AgregarMedico(medico).subscribe(()=>{
      this.todosMedicos = [];
      this.obtenerMedicos();
      this.snack.open('El médico se ha añadido correctamente', '',{
        duration: 3000,
      });
      this.fg.reset();
    })
  }

  deleteMedico(i: number)
  {
    const dialogRef = this.dialog.open(DialogComponent, 
      {
        width: '300px',
        data: 'Confirmar',
      });

      dialogRef.afterClosed().subscribe(result =>{
        if(result)
        {
          const idMed = this.todosMedicos[i].idMedico;
          this.ms.BorrarMedico(idMed.toString()).subscribe(()=>
          {
            this.todosMedicos = [];
            this.obtenerMedicos();
          });
          this.snack.open('Médico eliminado correctamente', '',
          {
            duration: 3000,
          });
        }
      });
  } 
  index: number;
  rellenarDatos(i:number)
  {
    this.comprobar = true;
    const obj = {Nombre: this.todosMedicos[i].Nombre, Exequatur: this.todosMedicos[i].Exequatur, Especialidad: this.todosMedicos[i].Especialidad};
    this.fg.setValue(obj);
    this.index = i;
  }
  
  modificarMedico()
  {
    let medico = new Medicos();
    medico.idMedico = this.todosMedicos[this.index].idMedico;
    medico.Nombre = this.fg.value.Nombre;
    medico.Exequatur = this.fg.value.Exequatur;
    medico.Especialidad = this.fg.value.Especialidad;

    this.ms.ModificarMedico(medico).subscribe(()=>
    {
      this.todosMedicos = [];
      this.obtenerMedicos();
      this.snack.open('Medico modificado correctamente', '',{
        duration: 3000
      });
      this.fg.reset();
      this.comprobar = false;
    })
  }
  
  get Nombre(){
    return this.fg.get('Nombre');
  }
  get Exequatur(){
    return this.fg.get('Exequatur');
  }
  get Especialidad(){
    return this.fg.get('Especialidad');
  }

}
