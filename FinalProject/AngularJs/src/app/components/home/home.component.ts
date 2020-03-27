import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

    medicos: any[];

    fg: FormGroup;
  constructor(private fb: FormBuilder, private gs: GeneralService,
    private ms: MedicosService) { }

  ngOnInit() {
    this.fg = this.fb.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Exequatur: [""],
      Especialidad: ["",[Validators.required]]
    });
    this.ms.ObtenerMedicos().subscribe((data:any) =>{
      this.medicos = data;
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
