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
    public class AltaMedicaController : ApiController
    {
        SistemaMedicoEntities db = new SistemaMedicoEntities();
           
        public List<AltaArreglada> GetAltas() 
        {
            return db.AltaMedica.Include("Pacientes").Select(am => new AltaArreglada()
            {
                idAltaMedica = am.idAltaMedica,
                NombrePaciente = am.Ingresos.Pacientes.Nombre,
                FechaIngreso = am.FehcaIngreso.ToString(),
                FechaSalida = am.FechaSalida.ToString(),
                Monto = (decimal)am.Monto
            }).ToList();
        }
        [HttpGet]
        [Route("api/AltaMedica/PorPaciente/{pac}")]
        public List<AltaArreglada> GetPorPaciente(string pac)
        {
            try
            {
                var listaCompleta = GetAltas();
                var pacientes = from p in listaCompleta where p.NombrePaciente.ToLower().Contains(pac) orderby p.NombrePaciente select p;
                return pacientes.ToList();
            }
            catch(Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/AltaMedica/PorFecha/{fech}")]
        public List<AltaArreglada> GetPorFecha(string fech)
        {
            try
            {
                var listaCompleta = GetAltas();
                var fechas = from f in listaCompleta where DateTime.Parse(f.FechaSalida) == DateTime.Parse(fech) orderby f.FechaSalida select f;
                return fechas.ToList();
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/AltaMedica/Opciones/{filtro}/{busqueda}/{total}/{suma}/{promedio}/{mayor}/{menor}")]
        public IHttpActionResult GetOpciones(string filtro, string busqueda, bool? total, bool? suma, bool? promedio, bool? mayor, bool? menor)
        {
            try
            {
                if (filtro == "Paciente")
                {
                    var listaCompleta = GetAltas();
                    var pacientes = from p in listaCompleta where p.NombrePaciente.ToLower().Contains(busqueda) orderby p.NombrePaciente select p;
                    Opciones opc = new Opciones();
                    if (total == true)
                    {
                        opc.Sumatoria = pacientes.ToList().Count();
                    }
                    if (suma == true)
                    {
                        opc.Conteo = pacientes.Sum(t => t.Monto);
                    }
                    if (promedio == true)
                    {
                        opc.Promedio = pacientes.Average(t => t.Monto);
                    }
                    if (mayor == true)
                    {
                        opc.MontoMayor = pacientes.Max(t => t.Monto);
                    }
                    if (menor == true)
                    {
                        opc.MontoMenor = pacientes.Min(t => t.Monto);
                    }
                    return Ok(opc);
                }
                else if(filtro == "Fecha")
                {
                    var listaCompleta = GetAltas();
                    var fechas = from f in listaCompleta where DateTime.Parse(f.FechaSalida) == DateTime.Parse(busqueda) orderby f.FechaSalida select f;
                    Opciones opc = new Opciones();
                    if (total == true)
                    {
                        opc.Sumatoria = fechas.ToList().Count();
                    }
                    if (suma == true)
                    {
                        opc.Conteo = fechas.Sum(t => t.Monto);
                    }
                    if (promedio == true)
                    {
                        opc.Promedio = fechas.Average(t => t.Monto);
                    }
                    if (mayor == true)
                    {
                        opc.MontoMayor = fechas.Max(t => t.Monto);
                    }
                    if (menor == true)
                    {
                        opc.MontoMenor = fechas.Min(t => t.Monto);
                    }
                    return Ok(opc);
                }
                return BadRequest();
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }


        [ResponseType(typeof(AltaMedica))]

        public IHttpActionResult PostAltaMedica(AltaMedica alta) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (string.IsNullOrEmpty(alta.idPaciente.ToString()) || string.IsNullOrEmpty(alta.idHabitacion.ToString()) || string.IsNullOrEmpty(alta.FechaSalida.ToString()) || string.IsNullOrEmpty(alta.FehcaIngreso.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.AltaMedica.Add(alta);
                    db.SaveChanges();
                    return CreatedAtRoute("DefaultApi", new { id = alta.idIngreso }, alta);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [ResponseType(typeof(AltaMedica))]

        public IHttpActionResult DeleteAltaMedica(int id, string tipo) 
        {
            var obtenerAltaMedica = db.AltaMedica.Where(am => am.idAltaMedica == id).FirstOrDefault();
            if(obtenerAltaMedica != null)
            {
                db.AltaMedica.Remove(obtenerAltaMedica);
                db.SaveChanges();
                return Ok("Alta médica eliminada correctamente");
            }
            return NotFound();
        }
    }
}
