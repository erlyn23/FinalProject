import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { AltasComponent } from './components/altas/altas.component';
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
},
{
  path: 'ingresos',
  component: IngresosComponent
},
{
  path: 'altas',
  component: AltasComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
