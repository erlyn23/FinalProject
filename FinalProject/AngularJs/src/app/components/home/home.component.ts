import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medicos } from 'src/app/Models/Medicos';
import { Observable } from 'rxjs';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todosMedicos: any[];
  Especialidades: any[] = ["Elige una opción...","Alergología",
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
    "Radiología"];

    Columnas: string[] = ["No.", "Nombre", "Exequatur", "Especialidad"];

    medicos: any[];

    fg: FormGroup;
    id: number;
    comprobar: boolean = false;
  constructor(private fb: FormBuilder, private gs: GeneralService,
    private ms: MedicosService,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.fg = this.fb.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Exequatur: ["", [Validators.required, Validators.maxLength(10)]],
      Especialidad: ["",[Validators.required]]
    });
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
      this.snack.open('El médico se ha añadido correctamente', 'Listo',{
        duration: 3000,
      });
      this.fg.reset();
    })
  }

  deleteMedico(i: number)
  {
    const idMed = this.todosMedicos[i].idMedico;
    this.ms.BorrarMedico(idMed.toString()).subscribe(()=>
    {
      this.todosMedicos = [];
      this.obtenerMedicos();
    });
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
