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
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader dr;

        public void Conexion()
        {
            //conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico1;";
            conexion.ConnectionString = "workstation id=SistemaMedico11.mssql.somee.com;packet size=4096;user id=emmanuel23_SQLLogin_1;pwd=8yjn4nrs1o;data source=SistemaMedico1.mssql.somee.com;persist security info=False;initial catalog=SistemaMedico1";
        }

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
            catch(Exception) 
            {
                return null;
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
            catch(Exception) 
            {
                return null;
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
            catch(Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Pacientes/Total/{filtro}/{busqueda}/{total}")]

        public int? GetTotal(string filtro, string busqueda, bool? total)
        {
            try
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
                catch (Exception)
                {
                    return 0;
                }
            }
            catch(Exception)
            {
                return 0;
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
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Pacientes where not idPaciente=" + pacientes.idPaciente;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    if (dr.GetString(1) == pacientes.Cedula)
                    {
                        return BadRequest("La cédula ya existe, intente con una nueva");
                    }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                db.SaveChanges();
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
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Pacientes";
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                  if (dr.GetString(1) == pacientes.Cedula)
                  {
                    return BadRequest("La cédula ya existe, intente con una nueva");
                  }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                if (string.IsNullOrEmpty(pacientes.Cedula) || string.IsNullOrEmpty(pacientes.Nombre) || string.IsNullOrEmpty(pacientes.Asegurado))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else if(pacientes.Asegurado != "Sí" && pacientes.Asegurado != "No") 
                {
                    return BadRequest("El campo Asegurado solo acepta una de dos respuestas sí o no");
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
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "Select*from Citas";
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    if (dr.GetInt32(2) == id)
                    {
                        return BadRequest("No se puede eliminar este paciente porque tiene citas pendientes");
                    }
                }
                dr.Close();
                cmd.Dispose();
                cmd.CommandText = "Select*from Ingresos";
                dr = cmd.ExecuteReader();
                while (dr.Read()) 
                { 
                  if(dr.GetInt32(3) == id) 
                  {
                    return BadRequest("No se puede eliminar este paciente porque tiene ingresos pendientes");
                  }
                }
                dr.Close();
                cmd.Dispose();
                cmd.CommandText = "Select*from AltaMedica";
                dr = cmd.ExecuteReader();
                while (dr.Read()) 
                { 
                  if(dr.GetInt32(3) == id) 
                  {
                    return BadRequest("No se puede eliminar este paciente porque está registrado en la tabla altas médicas");
                  }
                }
                dr.Close();
                cmd.Dispose();
                conexion.Close();
                db.Pacientes.Remove(pacientes);
                db.SaveChanges();
                return Ok(pacientes);
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