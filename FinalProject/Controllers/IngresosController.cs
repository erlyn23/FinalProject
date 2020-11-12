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
    public class IngresosController : ApiController
    {
        private SistemaMedicoEntities db = new SistemaMedicoEntities();

        [HttpGet]
        public List<IngresosArreglados> GetIngresos() 
        {
            return db.Ingresos.SqlQuery("select i.idIngreso, i.idPaciente,i.idHabitacion, p.Nombre, h.Numero, i.FechaIngreso from  " +
                "Ingresos i inner join Pacientes p on i.idPaciente = p.idPaciente " +
                "inner join Habitaciones h on i.idHabitacion = h.idHabitacion left join AltaMedica am " +
                "on i.idIngreso = am.idIngreso where am.idIngreso is null").Select(i => new IngresosArreglados()
                {
                    idIngreso = i.idIngreso,
                    idPaciente = i.idPaciente,
                    NombrePaciente = i.Pacientes.Nombre,
                    NumeroHabitacion = i.Habitaciones.Numero,
                    FechaIngreso = i.FechaIngreso
                }).ToList();
        }

        [HttpGet]
        [Route("Ingresos2")]
        public IQueryable<Ingresos> GetIngresos2()
        {
            return db.Ingresos;
        }

        [HttpGet]
        [Route("api/Ingresos/PorFecha/{fecha}")]
        public List<IngresosArreglados> GetPorFecha(string fecha) 
        {
            try
            {
                var listaCompleta = GetIngresos();
                var fechas = from f in listaCompleta where f.FechaIngreso == DateTime.Parse(fecha) orderby f.FechaIngreso select f;
                return fechas.ToList();
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Ingresos/PorHabitacion/{num}")]
        public List<IngresosArreglados> GetPorHabitacion(int num)
        {
            try
            {
                var listaCompleta = GetIngresos();
                var numeros = from n in listaCompleta where n.NumeroHabitacion == num orderby n.NumeroHabitacion select n;
                return numeros.ToList();
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        [HttpGet]
        [Route("api/Ingresos/Total/{filtro}/{busqueda}/{total}")]
        public int? Total(string filtro, string busqueda, bool? total)
        {
            try
            {
                var listaCompleta = GetIngresos();
                if (filtro == "Habitacion")
                {
                    var habitaciones = from h in listaCompleta where h.NumeroHabitacion.ToString().Contains(busqueda) orderby h.NumeroHabitacion select h;
                    Opciones opc = new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = habitaciones.ToList().Count();
                        return opc.Sumatoria;
                    }
                    else
                    {
                        return 0;
                    }
                }
                else if (filtro == "Fecha")
                {
                    var fechas = from f in listaCompleta where f.FechaIngreso == DateTime.Parse(busqueda) orderby f.FechaIngreso select f;
                    Opciones opc = new Opciones();
                    if (total.HasValue)
                    {
                        opc.Sumatoria = fechas.ToList().Count();
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

        [HttpPost]
        [Route("api/Ingresos/AgregarIngreso", Name = "addIngreso")]
        [ResponseType(typeof(Ingresos))]

        public IHttpActionResult PostIngresos(Ingresos ingreso) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var obtenerIngresos = GetIngresos();
                foreach (var item in obtenerIngresos)
                {
                    if (item.idPaciente == ingreso.idPaciente)
                    {
                        return BadRequest("El paciente ya ha sido ingresado en una habitación, primero registre el alta médica e ingréselo de nuevo");
                    }
                }
                if (string.IsNullOrEmpty(ingreso.idPaciente.ToString()) || string.IsNullOrEmpty(ingreso.idHabitacion.ToString()) || string.IsNullOrEmpty(ingreso.FechaIngreso.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.Ingresos.Add(ingreso);
                    db.SaveChanges();
                    return CreatedAtRoute("addIngreso", new { id = ingreso.idIngreso }, ingreso);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [ResponseType(typeof(Ingresos))]

        public IHttpActionResult DeleteIngreso(int id) 
        {
            var obtenerIngreso = db.Ingresos.Where(i => i.idIngreso == id).FirstOrDefault();
            if(obtenerIngreso != null)
            {
                db.Ingresos.Remove(obtenerIngreso);
                db.SaveChanges();
                return Ok("Ingreso eliminado correctamente");
            }
            return BadRequest();
        }
    }
}
