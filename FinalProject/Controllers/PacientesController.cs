using System;
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
        private SistemaMedicoEntities db = new SistemaMedicoEntities();
        // GET: api/Pacientes
        public IQueryable<Pacientes> GetPacientes()
        {
            return db.Pacientes;
        }

        [HttpGet]
        [Route("api/Pacientes/PorNombre/{nom}")]
        public IQueryable<Pacientes> GetPorNombre(string nom) 
        {
            try
            {
                var listaCompleta = db.Pacientes;
                var nombres = from n in listaCompleta where n.Nombre.ToLower().Contains(nom) orderby n.Nombre select n;
                return nombres;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Pacientes/PorCedula/{ced}")]
        public IQueryable<Pacientes> GetPorCedula(string ced) 
        {
            try
            {
                var listaCompleta = db.Pacientes;
                var cedulas = from c in listaCompleta where c.Cedula.Contains(ced) orderby c.Cedula select c;
                return cedulas;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Pacientes/PorAsegurados/{asg}")]
        public IQueryable<Pacientes> GetPorAsegurados(string asg) 
        {
            try
            {
                var listaCompleta = db.Pacientes;
                var asegurados = from a in listaCompleta where a.Asegurado.Contains(asg) orderby a.Asegurado select a;
                return asegurados;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Pacientes/Total/{filtro}/{busqueda}/{total}")]

        public int? GetTotal(string filtro, string busqueda, bool? total)
        {
            try
            {
                var listaCompleta = db.Pacientes;
                if (filtro == "Cedula")
                {
                    var cedulas = from c in listaCompleta where c.Cedula.ToLower().Contains(busqueda) orderby c.Cedula select c;
                    Opciones opc = new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = cedulas.Count();
                        return opc.Sumatoria;
                    }
                    else
                    {
                        return 0;
                    }
                }
                else if (filtro == "Nombre")
                {
                    var nombres = from n in listaCompleta where n.Nombre.ToLower().Contains(busqueda) orderby n.Nombre select n;
                    Opciones opc = new Opciones();
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
                else if (filtro == "Asegurados")
                {
                    var asegurados = from a in listaCompleta where a.Asegurado.ToLower().Contains(busqueda) orderby a.Asegurado select a;
                    Opciones opc = new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = asegurados.Count();
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
                var dbPacientes = db.Pacientes.Where(p => p.idPaciente != pacientes.idPaciente).ToList();
                foreach (var item in dbPacientes)
                {
                    if (item.Cedula == pacientes.Cedula)
                    {
                        return BadRequest("La cédula ya existe, intente con una nueva");
                    }
                }
                db.SaveChanges();
                return Ok("Paciente modificado correctamente");
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
        [HttpPost]
        [Route("api/Pacientes/AgregarPaciente", Name = "addPaciente")]
        [ResponseType(typeof(Pacientes))]
        public IHttpActionResult PostPacientes(Pacientes pacientes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var dbPacientes = db.Pacientes.Where(p => p.idPaciente != pacientes.idPaciente).ToList();
                foreach (var item in dbPacientes)
                {
                    if (item.Cedula == pacientes.Cedula)
                    {
                        return BadRequest("La cédula ya existe, intente con una nueva");
                    }
                }
               
                if (string.IsNullOrEmpty(pacientes.Cedula) || string.IsNullOrEmpty(pacientes.Nombre) || string.IsNullOrEmpty(pacientes.Asegurado))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.Pacientes.Add(pacientes);
                    db.SaveChanges();
                    return CreatedAtRoute("addPaciente", new { id = pacientes.idPaciente }, pacientes);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
                var citas = db.Citas.Where(c => c.idPaciente == id).ToList();
                if(citas.Count > 0)
                {
                    foreach(var cita in citas)
                    {
                        db.Citas.Remove(cita);
                        db.SaveChanges();
                    }
                }

                var altasMedicas = db.AltaMedica.Where(am => am.idPaciente == id).ToList();
                if (altasMedicas.Count > 0)
                {
                    foreach (var altaMedica in altasMedicas)
                    {
                        db.AltaMedica.Remove(altaMedica);
                        db.SaveChanges();
                    }
                }

                var ingresos = db.Ingresos.Where(i => i.idPaciente == id).ToList();
                if(ingresos.Count > 0)
                {
                    foreach(var ingreso in ingresos)
                    {
                        db.Ingresos.Remove(ingreso);
                        db.SaveChanges();
                    }
                }

                db.Pacientes.Remove(pacientes);
                db.SaveChanges();
                return Ok("Paciente eliminado correctamente");
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