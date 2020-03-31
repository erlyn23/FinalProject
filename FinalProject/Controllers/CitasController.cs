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
        private SistemaMedicoEntities db = new SistemaMedicoEntities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader reader;
       
        public List<CitasArregladas> GetCitas() 
        {
            List<CitasArregladas> salida = new List<CitasArregladas>();
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico;";
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

        [ResponseType(typeof(Citas))]
        public IHttpActionResult PostCitas(Citas cita) 
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            DateTime fecha = DateTime.Now;
            if(cita.Fecha < fecha) 
            {
                return BadRequest("Fecha invalida o pasada");
            }
            else 
            {
                db.Citas.Add(cita);
                db.SaveChanges();
            }

            return CreatedAtRoute("DefaultApi", new { id = cita.idCita }, cita);
        }

        [ResponseType(typeof(Citas))]

        public IHttpActionResult DeleteCita(int id, string tipo) 
        {
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico;";
            conexion.Open();
            cmd.Connection = conexion;
            if(tipo == "Médico") 
            {
                string query = "delete from Citas where idMedico=" + id;
                cmd.CommandText = query;
                cmd.ExecuteNonQuery();
            }
            else if(tipo == "Paciente") 
            {
                string query = "delete from Citas where idPaciente=" + id;
                cmd.CommandText = query;
                cmd.ExecuteNonQuery();
            }
            
            cmd.Dispose();
            conexion.Close();
            return Ok(id);

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
