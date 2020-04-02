using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.IO;
using System.Net.Http;
using System.Web.Hosting;
using System.Web;
using System.Web.Http;
using System.Data.SqlClient;
using System.Web.Http.Description;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class MedicosController : ApiController
    {
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader dr;


        public void Conexion()
        {
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico1;";
        }
        // GET: api/Medicos
        public IQueryable<Medicos> GetMedicos()
        {
            return db.Medicos;
        }

        // GET: api/Medicos/5
        [ResponseType(typeof(Medicos))]
        public IHttpActionResult GetMedicos(int id)
        {
            Medicos medicos = db.Medicos.Find(id);
            if (medicos == null)
            {
                return NotFound();
            }

            return Ok(medicos);
        }

        // PUT: api/Medicos/5
        [ResponseType(typeof(void))]
        public  IHttpActionResult PutMedicos(Medicos medicos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Entry(medicos).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicosExists(medicos.idMedico))
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

        // POST: api/Medicos
        [ResponseType(typeof(Medicos))]
        public IHttpActionResult PostMedicos(Medicos medicos)
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
                cmd.CommandText = "Select*from Medicos";
                dr = cmd.ExecuteReader();
                if (dr.Read()) 
                {
                    while (dr.Read())
                    {
                        if(dr.GetInt32(2) == medicos.Exequatur) 
                        {
                            return BadRequest("El exequatur ya existe intente con uno nuevo");
                        }
                    }
                }
                if (string.IsNullOrEmpty(medicos.Nombre) || string.IsNullOrEmpty(medicos.Exequatur.ToString()) || string.IsNullOrEmpty(medicos.Especialidad))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.Medicos.Add(medicos);
                    db.SaveChanges();
                }
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }

            return CreatedAtRoute("DefaultApi", new { id = medicos.idMedico }, medicos);
        }

        // DELETE: api/Medicos/5
        [ResponseType(typeof(Medicos))]
        public IHttpActionResult DeleteMedicos(int id)
        {
            Medicos medicos = db.Medicos.Find(id);
            if (medicos == null)
            {
                return NotFound();
            }

            db.Medicos.Remove(medicos);
            db.SaveChanges();

            return Ok(medicos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MedicosExists(int id)
        {
            return db.Medicos.Count(e => e.idMedico == id) > 0;
        }
    }
}