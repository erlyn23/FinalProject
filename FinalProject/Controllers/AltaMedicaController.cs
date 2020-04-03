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
        SistemaMedico1Entities db = new SistemaMedico1Entities();
        SqlConnection conexion = new SqlConnection();
        SqlCommand cmd = new SqlCommand();
        SqlDataReader dr;
           
        public List<AltaArreglada> GetAltas() 
        {
            try
            {
                List<AltaArreglada> alta = new List<AltaArreglada>();
                AltaArreglada alta1;
                conexion.ConnectionString = "data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN; integrated security = SSPI; database=SistemaMedico1";
                conexion.Open();
                cmd.Connection = conexion;
                cmd.CommandText = "select a.idAltaMedica, p.Nombre, i.FechaIngreso, a.FechaSalida, a.Monto from AltaMedica a inner join Pacientes p on a.idPaciente = p.idPaciente inner join Ingresos i on i.idIngreso = a.idIngreso";
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    alta1 = new AltaArreglada();
                    alta1.idAltaMedica = dr.GetInt32(0);
                    alta1.NombrePaciente = dr.GetString(1);
                    alta1.FechaIngreso = dr.GetDateTime(2).ToString();
                    alta1.FechaSalida = dr.GetDateTime(3).ToString();
                    alta1.Monto = dr.GetDecimal(4);
                    alta.Add(alta1);
                }
                cmd.Dispose();
                conexion.Close();
                return alta;
            }
            catch(Exception ex) 
            {
                return null;
            }
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
            catch(Exception ex)
            {
                return null;
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
            catch (Exception ex)
            {
                return null;
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
            try
            {
                conexion.ConnectionString = "data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN; integrated security = SSPI; database=SistemaMedico1";
                conexion.Open();
                cmd.Connection = conexion;
                switch (tipo)
                {
                    case "Paciente":
                        string query1 = "delete from AltaMedica where idPaciente=" + id;
                        cmd.CommandText = query1;
                        cmd.ExecuteNonQuery();
                        break;
                    case "Habitacion":
                        string query2 = "delete from AltaMedica where idHabitacion=" + id;
                        cmd.CommandText = query2;
                        cmd.ExecuteNonQuery();
                        break;
                    default:
                        string query3 = "delete from AltaMedica where idAltaMedica=" + id;
                        cmd.CommandText = query3;
                        cmd.ExecuteNonQuery();
                        break;
                }
                cmd.Dispose();
                conexion.Close();
                return Ok(id);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
