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
using System.Data.SqlClient;
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class CitasController : ApiController
    {
        private SistemaMedicoEntities db = new SistemaMedicoEntities();

        [HttpGet]
        public List<CitasArregladas> GetCitas() 
        {
            return db.Citas.Include("Medicos").Include("Pacientes").Select(c => new CitasArregladas()
            {
                IdCita = c.idCita,
                NombreMedico = c.Medicos.Nombre,
                NombrePaciente = c.Pacientes.Nombre,
                Fecha = c.Fecha.ToString(),
                Hora = c.Hora.ToString()
            }).ToList();
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
            catch(Exception exception)
            {
                throw exception;
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
            catch (Exception exception)
            {
                throw exception;
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
            catch (Exception exception)
            {
                throw exception;
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
            catch (Exception exception)
            {
                throw exception;
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
                    if((com.idMedico == cita.idMedico || com.idMedico != cita.idMedico) && com.idPaciente == cita.idPaciente 
                        && com.Fecha.Day == cita.Fecha.Day && com.Fecha.Month == cita.Fecha.Month 
                        && com.Fecha.Year == cita.Fecha.Year && com.Hora == cita.Hora)
                    {
                        return BadRequest("Este paciente ya tiene una cita agendada ese día a esa hora, intente con una nueva.");
                    }
                }
                if (string.IsNullOrEmpty(cita.idPaciente.ToString()) || string.IsNullOrEmpty(cita.idMedico.ToString()) 
                    || string.IsNullOrEmpty(cita.Fecha.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                if (DateTime.Parse(cita.Hora.ToString()) > DateTime.Parse("20:00")
                    || DateTime.Parse(cita.Hora.ToString()) < DateTime.Parse("8:00")) 
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
        [HttpDelete]
        [Route("api/Citas/{id}/{tipo}")]
        public IHttpActionResult DeleteCita(int id, string tipo) 
        {
            var obtenerCitaPorIdCita = db.Citas.Where(c => c.idCita == id).FirstOrDefault();
            if(obtenerCitaPorIdCita != null)
            {
                db.Citas.Remove(obtenerCitaPorIdCita);
                db.SaveChanges();
                return Ok("Cita eliminada correctamente");
            }
            return BadRequest("Ha ocurrido un error al eliminar la cita");
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
