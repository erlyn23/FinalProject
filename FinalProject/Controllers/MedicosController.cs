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
        private SistemaMedicoEntities db = new SistemaMedicoEntities();


        [HttpGet]
        public IQueryable<Medicos> GetMedicos()
        {
            return db.Medicos;
        }

        [HttpGet]
        [Route("api/Medicos/PorNombre/{nom}")]

        public IQueryable<Medicos> GetPorNombre(string nom) 
        {
            try
            {
                var listaCompleta = db.Medicos;
                var nombres = from n in listaCompleta where n.Nombre.ToLower().Contains(nom) orderby n.Nombre select n;
                return nombres;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Medicos/PorEspecialidad/{spc}")]

        public IQueryable<Medicos> GetPorEspecialidad(string spc) 
        {
            try
            {
                var listaCompleta = db.Medicos;
                var especialidades = from e in listaCompleta where e.Especialidad.ToLower().Contains(spc) orderby e.Especialidad select e;
                return especialidades;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Medicos/Total/{filtro}/{busqueda}/{total}")]

        public int? Total(string filtro, string busqueda, bool? total)
        {
            try
            {
                var listaCompleta = db.Medicos;
                if(filtro == "Nombre")
                {
                    var nombres = from n in listaCompleta where n.Nombre.ToLower().Contains(busqueda) orderby n.Nombre select n;
                    Opciones  opc= new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = nombres.Count();
                        return opc.Sumatoria;
                    }
                    else
                    {
                        return 0;
                    }
                }
                else if(filtro == "Especialidad")
                {
                    var especialidades = from e in listaCompleta where e.Especialidad.ToLower().Contains(busqueda) orderby e.Especialidad select e;
                    Opciones opc = new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = especialidades.Count();
                        return opc.Sumatoria;
                    }
                    else
                    {
                        return 0;
                    }
                }
                return 0;
            }
            catch (Exception exception)
            {
                throw exception;
            }
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
                var dbMedicos = db.Medicos.Where(m => m.idMedico != medicos.idMedico).ToList();
                foreach (var item in dbMedicos)
                {
                  if (item.Exequatur == medicos.Exequatur)
                  {
                    return BadRequest("El exequatur ya existe intente con uno nuevo");
                  }
                }
                db.SaveChanges();
                return Ok("Médico modificado correctamente");
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
        }

        // POST: api/Medicos
        [HttpPost]
        [Route("api/Medicos/AgregarMedico",Name ="AddMedico")]
        [ResponseType(typeof(Medicos))]
        public IHttpActionResult PostMedicos(Medicos medicos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try 
            {
                var dbMedicos = db.Medicos.Where(m => m.idMedico != medicos.idMedico).ToList();
                foreach (var item in dbMedicos)
                {
                  if(item.Exequatur == medicos.Exequatur) 
                  {
                    return BadRequest("El exequatur ya existe intente con uno nuevo");
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
                    return CreatedAtRoute("AddMedico", new { id = medicos.idMedico }, medicos);
                }
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
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

            try 
            {
                var citas = db.Citas.Where(c => c.idMedico == id).ToList();
                if (citas.Count > 0) 
                { 
                    foreach(var cita in citas)
                    {
                        db.Citas.Remove(cita);
                        db.SaveChanges();
                    }
                }
                db.Medicos.Remove(medicos);
                db.SaveChanges();
                return Ok("Médico eliminado correctamente");
            }
            catch(Exception e) 
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

        private bool MedicosExists(int id)
        {
            return db.Medicos.Count(e => e.idMedico == id) > 0;
        }
    }
}