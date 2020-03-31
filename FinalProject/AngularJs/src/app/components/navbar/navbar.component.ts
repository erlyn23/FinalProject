import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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

}
