﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using System.Web.Http.Description;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class PacientesController : ApiController
    {
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader dr;

        public void Conexion()
        {
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico1;";
        }

        // GET: api/Pacientes
        public IQueryable<Pacientes> GetPacientes()
        {
            return db.Pacientes;
        }

        // GET: api/Pacientes/5
        [ResponseType(typeof(Pacientes))]
        public IHttpActionResult GetPacientes(int id)
        {
            Pacientes pacientes = db.Pacientes.Find(id);
            if (pacientes == null)
            {
                return NotFound();
            }

            return Ok(pacientes);
        }

        // PUT: api/Pacientes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPacientes(Pacientes pacientes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            db.Entry(pacientes).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PacientesExists(pacientes.idPaciente))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Pacientes
        [ResponseType(typeof(Pacientes))]
        public IHttpActionResult PostPacientes(Pacientes pacientes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Pacientes";
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    while (dr.Read())
                    {
                        if (dr.GetString(1) == pacientes.Cedula)
                        {
                            return BadRequest("La cédula ya existe intente con uno nuevo");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                if (string.IsNullOrEmpty(pacientes.Cedula) || string.IsNullOrEmpty(pacientes.Nombre) || string.IsNullOrEmpty(pacientes.Asegurado))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else if(pacientes.Asegurado != "Sí" || pacientes.Asegurado != "No") 
                {
                    return BadRequest("Este campo solo acepta dos respuestas sí o no");
                }
                else
                {
                    db.Pacientes.Add(pacientes);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return CreatedAtRoute("DefaultApi", new { id = pacientes.idPaciente }, pacientes);
        }

        // DELETE: api/Pacientes/5
        [ResponseType(typeof(Pacientes))]
        public IHttpActionResult DeletePacientes(int id)
        {
            Pacientes pacientes = db.Pacientes.Find(id);
            if (pacientes == null)
            {
                return NotFound();
            }
            try
            {
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Citas";
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    while (dr.Read())
                    {
                        if (dr.GetInt32(2) == id)
                        {
                            return BadRequest("No se puede eliminar este paciente porque tiene citas pendientes");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                cmd.CommandText = "Select*from Ingresos";
                dr = cmd.ExecuteReader();
                if (dr.Read()) 
                {
                    while (dr.Read()) 
                    { 
                        if(dr.GetInt32(3) == id) 
                        {
                            return BadRequest("No se puede eliminar este paciente porque tiene ingresos pendientes");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                cmd.CommandText = "Select*from AltaMedica";
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    while (dr.Read()) 
                    { 
                        if(dr.GetInt32(3) == id) 
                        {
                            return BadRequest("No se puede eliminar este paciente porque está registrado en la tabla altas médicas");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                db.Pacientes.Remove(pacientes);
                db.SaveChanges();
                return Ok(pacientes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
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

        private bool PacientesExists(int id)
        {
            return db.Pacientes.Count(e => e.idPaciente == id) > 0;
        }
    }
}