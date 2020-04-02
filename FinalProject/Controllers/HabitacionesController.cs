using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using FinalProject.Models;
using System.Data.SqlClient;

namespace FinalProject.Controllers
{
    [RoutePrefix("api/Habitaciones")]
    public class HabitacionesController : ApiController
    {
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader dr;


        public void Conexion()
        {
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico1;";
        }
        // GET: api/Habitaciones
        public IQueryable<Habitaciones> GetHabitaciones()
        {
            return db.Habitaciones;
        }

        [Route("PorTipo")]
        public IQueryable<Habitaciones> GetPorTipo(string tip) 
        {
            try
            {
                var listaCompleta = db.Habitaciones;
                var tipos = from t in listaCompleta where t.Tipo == tip orderby t.Tipo select t;
                return tipos;
            }
            catch(Exception ex) 
            {
                return null;
            }
        }

        // GET: api/Habitaciones/5
        [ResponseType(typeof(Habitaciones))]
        public IHttpActionResult GetHabitaciones(int id)
        {
            Habitaciones habitaciones = db.Habitaciones.Find(id);
            if (habitaciones == null)
            {
                return NotFound();
            }

            return Ok(habitaciones);
        }

        // PUT: api/Habitaciones/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutHabitaciones(Habitaciones habitaciones)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Entry(habitaciones).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitacionesExists(habitaciones.idHabitacion))
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

        // POST: api/Habitaciones
        [ResponseType(typeof(Habitaciones))]
        public IHttpActionResult PostHabitaciones(Habitaciones habitaciones)
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
                cmd.CommandText = "Select*from Habitaciones";
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    while (dr.Read())
                    {
                        if (dr.GetInt32(1) == habitaciones.Numero)
                        {
                            return BadRequest("El número de habitación ya existe intente con uno nuevo");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                if (string.IsNullOrEmpty(habitaciones.Numero.ToString()) || string.IsNullOrEmpty(habitaciones.Tipo) || string.IsNullOrEmpty(habitaciones.PrecioxDia.ToString()) || string.IsNullOrEmpty(habitaciones.Disponible.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.Habitaciones.Add(habitaciones);
                    db.SaveChanges();
                    return CreatedAtRoute("DefaultApi", new { id = habitaciones.idHabitacion }, habitaciones);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Habitaciones/5
        [ResponseType(typeof(Habitaciones))]
        public IHttpActionResult DeleteHabitaciones(int id)
        {
            Habitaciones habitaciones = db.Habitaciones.Find(id);
            if (habitaciones == null)
            {
                return NotFound();
            }

            try
            {
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Ingresos";
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    while (dr.Read())
                    {
                        if (dr.GetInt32(2) == id)
                        {
                            return BadRequest("No se puede eliminar esta habitación porque tiene ingresos pendientes");
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
                        if (dr.GetInt32(2) == id)
                        {
                            return BadRequest("No se puede eliminar esta habitación porque está registrado en la tabla altas médicas");
                        }
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                db.Habitaciones.Remove(habitaciones);
                db.SaveChanges();
                return Ok(habitaciones);
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

        private bool HabitacionesExists(int id)
        {
            return db.Habitaciones.Count(e => e.idHabitacion == id) > 0;
        }
    }
}