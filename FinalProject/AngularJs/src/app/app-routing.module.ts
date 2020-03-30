import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';
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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
