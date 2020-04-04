import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  Medicos(){
    this.router.navigate(['']);
  }

  Pacientes(){
    this.router.navigate(['/pacientes']);
  }

  Citas(){
    this.router.navigate(['/citas']);
  }

  Habitaciones(){
    this.router.navigate(['/habitaciones']);
  }

  Ingresos(){
    this.router.navigate(['/ingresos']);
  }

  AltaMedica(){
    this.router.navigate(['/altas']);
  }

}
