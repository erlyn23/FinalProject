import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
const routes: Routes = [
{
  path:'',
  component: HomeComponent
},
{
  path: 'pacientes',
  component: PacientesComponent
},
{
  path: 'citas',
  component: CitasComponent
},
{
  path: 'habitaciones',
  component: HabitacionesComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
