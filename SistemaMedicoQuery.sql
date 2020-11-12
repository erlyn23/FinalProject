create database SistemaMedico
go

use SistemaMedico
go

create table Medicos(idMedico int not null identity(1,1),
Nombre varchar(50) not null, 
Exequatur int,
Especialidad varchar(50) not null,
constraint pk_Medicos primary key(idMedico))
go

create table Pacientes(idPaciente int not null identity(1,1),
Cedula varchar(13) not null,
Nombre varchar(50)not null,
Asegurado char(2),
constraint pk_Pacientes primary key(idPaciente),
constraint idx_Pacientes unique(Cedula),
constraint ck_Asegurado check (Asegurado in('Sí','No')))
go

create table Habitaciones(idHabitacion int not null identity(1,1),
Numero int not null,
Tipo varchar(15),
PrecioxDia decimal(6,2) not null,
Disponible int,
constraint pk_Habitaciones primary key(idHabitacion),
constraint idx_Habitaciones unique(Numero),
constraint ck_Habitaciones check (Disponible in(0,1,2)))
go


create table Citas(idCita int not null identity(1,1),
idPaciente int not null,
idMedico int not null,
Fecha date not null,
Hora time not null,
constraint pk_Paciente_Medico primary key(idCita, idPaciente, idMedico),
constraint fk_Paciente foreign key(idPaciente) references Pacientes,
constraint fk_Medico foreign key(idMedico) references Medicos)
go

create table Ingresos(idIngreso int not null identity(1,1),
FechaIngreso date not null,
idHabitacion int not null,
idPaciente int not null,
constraint pk_Habitacion_Pacientes primary key(idIngreso, idHabitacion, idPaciente),
constraint fk_Habitacion foreign key(idHabitacion) references Habitaciones,
constraint fk_Paciente_Ingresos foreign key(idPaciente) references Pacientes)
go

create table AltaMedica(idAltaMedica int not null identity(1,1),
idIngreso int not null, 
idHabitacion int,
idPaciente int,
FehcaIngreso date not null,
FechaSalida date not null,
Monto decimal(6,2),
constraint pk_AltaMedica primary key(idAltaMedica),
constraint fk_Ingreso foreign key(idIngreso, idHabitacion, idPaciente) 
references Ingresos(idIngreso, idHabitacion, idPaciente),

constraint idx_Ingreso unique(idIngreso)
)
go

create trigger dbo.trg_AltaMedica on AltaMedica
after insert 
as
begin 
	declare @id int 
	declare @tipo varchar(30)
	declare @Disponible int
	select @id = idHabitacion from inserted
	select @tipo = Tipo from Habitaciones where idHabitacion = @id
	select @Disponible = Disponible from Habitaciones where idHabitacion = @id
		
		if @tipo = 'Doble' and @Disponible = 0
		begin
			update Habitaciones set Disponible = 1, Tipo = 'Doble' where idHabitacion = @id
		end
		else if @tipo = 'Doble' and @Disponible = 1
		begin
			update Habitaciones set Disponible = 2, Tipo = 'Doble' where idHabitacion = @id
		end
		else
		begin 
			update Habitaciones set Disponible = 1, Tipo = @tipo where idHabitacion = @id
		end
end
go


create trigger dbo.trg_Ingresos on Ingresos
after insert 
as
begin 
	declare @id int 
	declare @tipo varchar(30)
	declare @Disponible int
	select @id = idHabitacion from inserted
	select @tipo = Tipo from Habitaciones where idHabitacion = @id
	select @Disponible = Disponible from Habitaciones where idHabitacion = @id
		
		if @tipo = 'Doble' and @Disponible = 2
		begin
			update Habitaciones set Disponible = 1, Tipo = 'Doble' where idHabitacion = @id
		end
		else if @tipo = 'Doble' and @Disponible = 1
		begin
			update Habitaciones set Disponible = 0, Tipo = 'Doble' where idHabitacion = @id
		end
		else
		begin 
			update Habitaciones set Disponible = 0, Tipo = @tipo where idHabitacion = @id
		end
end
go
