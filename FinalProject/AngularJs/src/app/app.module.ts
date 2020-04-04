import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule } from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {HttpClientModule} from '@angular/common/http';
import {MatToolbarModule, MatCard, MatCheckbox, MatMenuModule, MatIconModule, MatPaginatorModule, MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatTableModule} from '@angular/material';
import {environment} from '../environments/environment';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { AltasComponent } from './components/altas/altas.component';
import { DialogErrorComponent } from './components/dialog-error/dialog-error.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    DialogComponent,
    PacientesComponent,
    CitasComponent,
    HabitacionesComponent,
    IngresosComponent,
    AltasComponent,
    DialogErrorComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, 
    AngularFireAuthModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxPaginationModule,
    NgxMaterialTimepickerModule.setLocale('es-ES'),
    MatTableModule,
    MatProgressSpinnerModule,
    
  ],
  entryComponents:[DialogComponent, DialogErrorComponent],
  providers: [{
    provide: MAT_DATE_LOCALE, useValue:'es-ES',
  },
  {
    provide: DialogComponent
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
