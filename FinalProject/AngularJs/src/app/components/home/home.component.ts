import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  datos: any[];
  constructor(private service: GeneralService) { }

  ngOnInit() {
    this.service.ObtenerCitas().subscribe(data =>{
      console.log(data);
    })
  }

}
