import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { MedicosService } from 'src/app/services/medicos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private gs: GeneralService,
    private ms: MedicosService) { }

  ngOnInit() {
   /* this.ms.ObtenerMedicos().subscribe((data:any) =>{
      
    })*/
  }

}
