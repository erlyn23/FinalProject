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
        private SistemaMedicoEntities db = new SistemaMedicoEntities();


        [HttpGet]
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
            catch (Exception exception)
            {
                throw exception;
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
                    if ((bool)total)
                    {
                        opc.Sumatoria = tipos.Count();
                    }
                    if ((bool)suma)
                    {
                        opc.Conteo = tipos.Sum(t => t.PrecioxDia);
                    }
                    if ((bool)promedio)
                    {
                        opc.Promedio = tipos.Average(t => t.PrecioxDia);
                    }
                    if ((bool)mayor)
                    {
                        opc.MontoMayor = tipos.Max(t => t.PrecioxDia);
                    }
                    if ((bool)menor)
                    {
                        opc.MontoMenor = tipos.Min(t => t.PrecioxDia);
                    }
                    return opc;
                }
                return null;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

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
                var dbHabitaciones = db.Habitaciones.Where(h=> h.idHabitacion != habitaciones.idHabitacion).ToList();
                foreach (var item in dbHabitaciones)
                {
                    if (item.Numero == habitaciones.Numero)
                    {
                        return BadRequest("El número de habitación ya existe, intente con uno nuevo");
                    }
                }
                db.SaveChanges();
                return Ok("Habitación modificada correctamente");
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
                var dbHabitaciones = db.Habitaciones.Where(h => h.idHabitacion != habitaciones.idHabitacion).ToList();
                foreach (var item in dbHabitaciones)
                {
                    if (item.Numero == habitaciones.Numero)
                    {
                        return BadRequest("El número de habitación ya existe, intente con uno nuevo");
                    }
                }
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
                var altasMedicas = db.AltaMedica.Where(am => am.idHabitacion == id).ToList();
                if (altasMedicas.Count > 0)
                {
                    foreach (var altaMedica in altasMedicas)
                    {
                        db.AltaMedica.Remove(altaMedica);
                        db.SaveChanges();
                    }
                }

                var ingresos = db.Ingresos.Where(i => i.idHabitacion == id).ToList();
                if (ingresos.Count > 0)
                {
                    foreach(var ingreso in ingresos)
                    {
                        db.Ingresos.Remove(ingreso);
                        db.SaveChanges();
                    }
                }
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