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

        [HttpGet]
        [Route("api/Habitaciones/PorTipo/{tip}")]
        public IQueryable<Habitaciones> GetPorTipo(string tip) 
        {
            try
            {
                var listaCompleta = db.Habitaciones;
                var tipos = from t in listaCompleta where t.Tipo.Contains(tip) orderby t.Tipo select t;
                return tipos;
            }
            catch(Exception) 
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Habitaciones/Opciones/{filtro}/{busqueda}/{total}/{suma}/{promedio}/{mayor}/{menor}")]
        public Opciones GetOpciones(string filtro, string busqueda, bool? total, bool? suma, bool? promedio, bool? mayor, bool? menor)
        {
            try
            {
                if(filtro== "Tipo")
                {
                    var listaCompleta = db.Habitaciones;
                    var tipos = from t in listaCompleta where t.Tipo.Contains(busqueda) orderby t.Tipo select t;
                    Opciones opc = new Opciones();
                    if (total == true)
                    {
                        opc.Sumatoria = tipos.Count();
                    }
                    if (suma == true)
                    {
                        opc.Conteo = tipos.Sum(t => t.PrecioxDia);
                    }
                    if (promedio == true)
                    {
                        opc.Promedio = tipos.Average(t => t.PrecioxDia);
                    }
                    if (mayor == true)
                    {
                        opc.MontoMayor = tipos.Max(t => t.PrecioxDia);
                    }
                    if (menor == true)
                    {
                        opc.MontoMenor = tipos.Min(t => t.PrecioxDia);
                    }
                    return opc;
                }
                return null;
            }
            catch(Exception)
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
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Habitaciones where not idHabitacion="+habitaciones.idHabitacion;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    if (dr.GetInt32(1) == habitaciones.Numero)
                    {
                        return BadRequest("El número de habitación ya existe, intente con uno nuevo");
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
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
        [Route("api/Habitaciones/AgregarHabitacion",Name ="addHabitacion")]
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
                while (dr.Read())
                {
                  if (dr.GetInt32(1) == habitaciones.Numero)
                  {
                    return BadRequest("El número de habitación ya existe, intente con uno nuevo");
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
                    return CreatedAtRoute("addHabitacion", new { id = habitaciones.idHabitacion }, habitaciones);
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
                while (dr.Read())
                {
                    if (dr.GetInt32(2) == id)
                    {
                        return BadRequest("No se puede eliminar esta habitación porque tiene ingresos pendientes");
                    }
                }
                dr.Close();
                cmd.Dispose();
                cmd.CommandText = "Select*from AltaMedica";
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    if (dr.GetInt32(2) == id)
                    {
                        return BadRequest("No se puede eliminar esta habitación porque está registrado en la tabla altas médicas");
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