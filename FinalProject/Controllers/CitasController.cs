﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.Data.SqlClient;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class CitasController : ApiController
    {
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader reader;

        public void Conexion()
        {
            //conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico1;";
            conexion.ConnectionString = "workstation id=SistemaMedico11.mssql.somee.com;packet size=4096;user id=emmanuel23_SQLLogin_1;pwd=8yjn4nrs1o;data source=SistemaMedico1.mssql.somee.com;persist security info=False;initial catalog=SistemaMedico1";
        }

        public List<CitasArregladas> GetCitas() 
        {
            try 
            {
                List<CitasArregladas> salida = new List<CitasArregladas>();
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "select c.idCita, m.Nombre, p.Nombre, c.Fecha, c.Hora from Citas c inner join Medicos m on c.idMedico = m.idMedico inner join Pacientes p on c.idPaciente = p.idPaciente ";
                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    CitasArregladas cita = new CitasArregladas();
                    cita.IdCita = reader.GetInt32(0);
                    cita.NombrePaciente = reader.GetString(2);
                    cita.NombreMedico = reader.GetString(1);
                    cita.Fecha = reader.GetDateTime(3).ToLongDateString();
                    cita.Hora = reader.GetTimeSpan(4).ToString();
                    salida.Add(cita);
                }
                cmd.Dispose();
                conexion.Close();
                return salida;
            }
            catch(Exception) 
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Citas/PorFecha/{Fecha}")]
        public List<CitasArregladas> GetPorFecha(string Fecha)
        {
            try
            {
                var listaCompleta = GetCitas();
                var fechas = from f in listaCompleta where DateTime.Parse(f.Fecha) == DateTime.Parse(Fecha) orderby f.Fecha select f;
                return fechas.ToList();
            }
            catch(Exception)
            {
                return null;
            }
        }


        [HttpGet]
        [Route("api/Citas/PorMedico/{med}")]
        public List<CitasArregladas> GetPorMedico(string med)
        {
            try
            {
                var listaCompleta = GetCitas();
                var medicos = from m in listaCompleta where m.NombreMedico.ToLower().Contains(med) orderby m.NombreMedico select m;
                return medicos.ToList();
            }
            catch(Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Citas/PorPaciente/{pac}")]
        public List<CitasArregladas> GetPorPaciente(string pac)
        {
            try
            {
                var listaCompleta = GetCitas();
                var pacientes = from p in listaCompleta where p.NombrePaciente.ToLower().Contains(pac) orderby p.NombrePaciente select p;
                return pacientes.ToList();
            }
            catch(Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Citas/Total/{filtro}/{busqueda}/{total}")]
        public int? GetTotal(string filtro, string busqueda, bool? total)
        {
            try 
            { 
                if(filtro == "NombrePaciente")
                {
                    var listaCompleta = GetCitas();
                    var pacientes = from p in listaCompleta where p.NombrePaciente.ToLower().Contains(busqueda) orderby p.NombrePaciente select p;
                    if (total.HasValue)
                    {
                        Opciones opc = new Opciones();
                        return opc.Sumatoria = pacientes.ToList().Count();
                    }
                }
                else if(filtro == "NombreMedico")
                {
                    var listaCompleta = GetCitas();
                    var medicos = from m in listaCompleta where m.NombreMedico.ToLower().Contains(busqueda) orderby m.NombreMedico select m;
                    if (total.HasValue)
                    {
                        Opciones opc = new Opciones();
                        return opc.Sumatoria = medicos.ToList().Count();
                    }
                }
                else if(filtro == "Fecha")
                {
                    var listaCompleta = GetCitas();
                    var fechas = from f in listaCompleta where DateTime.Parse(f.Fecha) == DateTime.Parse(busqueda) orderby f.Fecha select f;
                    if (total.HasValue)
                    {
                        Opciones opc = new Opciones();
                        return opc.Sumatoria = fechas.ToList().Count();
                    }
                }
                return 0;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        [HttpPost]
        [ResponseType(typeof(Citas))]
        [Route("api/Citas/AgregarCita",Name ="addCita")]
        public IHttpActionResult PostCitas(Citas cita) 
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            try
            {
                var comparar = db.Citas;
                foreach(var com in comparar)
                {
                    if(com.idMedico == cita.idMedico && com.idPaciente == cita.idPaciente && com.Fecha.Day == cita.Fecha.Day && com.Fecha.Month == cita.Fecha.Month && com.Fecha.Year == cita.Fecha.Year && com.Hora == cita.Hora)
                    {
                        return BadRequest("Este paciente ya tiene una cita agendada con este doctor ese día a esa hora");
                    }
                }
                if (string.IsNullOrEmpty(cita.idPaciente.ToString()) || string.IsNullOrEmpty(cita.idMedico.ToString()) || string.IsNullOrEmpty(cita.Fecha.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                if (DateTime.Parse(cita.Hora.ToString()) > DateTime.Parse("20:00") || DateTime.Parse(cita.Hora.ToString()) < DateTime.Parse("8:00")) 
                {
                    return BadRequest("Hora no permitida, el horario de citas es de 8:00a.m. a 8:00p.m.");
                }
                else
                {
                    db.Citas.Add(cita);
                    db.SaveChanges();
                    return CreatedAtRoute("addCita", new { id = cita.idCita }, cita);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [ResponseType(typeof(Citas))]

        public IHttpActionResult DeleteCita(int id, string tipo) 
        {
            try 
            {
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                switch (tipo)
                {
                    case "Médico":
                        string query = "delete from Citas where idMedico=" + id;
                        cmd.CommandText = query;
                        cmd.ExecuteNonQuery();
                        break;
                    case "Paciente":
                        string query1 = "delete from Citas where idPaciente=" + id;
                        cmd.CommandText = query1;
                        cmd.ExecuteNonQuery();
                        break;
                    case "Cita":
                        string query2 = "delete from Citas where idCita=" + id;
                        cmd.CommandText = query2;
                        cmd.ExecuteNonQuery();
                        break;
                }

                cmd.Dispose();
                conexion.Close();
                return Ok(id);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) 
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
