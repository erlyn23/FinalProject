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
            List<AltaArreglada> alta = new List<AltaArreglada>();
            AltaArreglada alta1;
            conexion.ConnectionString = "data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN; integrated security = SSPI; database=SistemaMedico1";
            conexion.Open();
            cmd.Connection = conexion;
            string query2 = "select a.idAltaMedica, p.Nombre, i.FechaIngreso, a.FechaSalida, a.Monto from AltaMedica a inner join Pacientes p on a.idPaciente = p.idPaciente inner join Ingresos i on i.idIngreso = a.idIngreso";
            cmd.CommandText = query2;
            dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    alta1 = new AltaArreglada();
                    alta1.idAltaMedica = dr.GetInt32(0);
                    alta1.NombrePaciente = dr.GetString(1);
                    alta1.FechaIngreso = dr.GetDateTime(2);
                    alta1.FechaSalida = dr.GetDateTime(3);
                    alta1.Monto = dr.GetDecimal(4);
                    alta.Add(alta1);
                }
                cmd.Dispose();
                conexion.Close();
            return alta;
        }

        [ResponseType(typeof(AltaMedica))]

        public IHttpActionResult PostAltaMedica(AltaMedica alta) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.AltaMedica.Add(alta);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = alta.idAltaMedica }, alta);
        }

        [ResponseType(typeof(AltaMedica))]

        public IHttpActionResult DeleteAltaMedica(int id, string tipo) 
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
    }
}
