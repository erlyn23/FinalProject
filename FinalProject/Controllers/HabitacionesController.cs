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

namespace FinalProject.Controllers
{
    public class HabitacionesController : ApiController
    {
        private SistemaMedicoEntities1 db = new SistemaMedicoEntities1();

        // GET: api/Habitaciones
        public IQueryable<Habitaciones> GetHabitaciones()
        {
            return db.Habitaciones;
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

            db.Habitaciones.Add(habitaciones);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = habitaciones.idHabitacion }, habitaciones);
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

            db.Habitaciones.Remove(habitaciones);
            db.SaveChanges();

            return Ok(habitaciones);
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