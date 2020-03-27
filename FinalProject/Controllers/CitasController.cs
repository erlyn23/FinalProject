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
    [RoutePrefix("api/Citas")]
    public class CitasController : ApiController
    {
        private SistemaMedicoEntities db = new SistemaMedicoEntities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader reader;
       
        [Route("ObtenerCitas")]
        public List<CitasArregladas> GetCitas() 
        {
            List<CitasArregladas> salida = new List<CitasArregladas>();
            conexion.ConnectionString = "Data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN;integrated security=SSPI;database=SistemaMedico;";
            conexion.Open();
            cmd.Connection = conexion;
            cmd.CommandText = "select c.idCita, m.Nombre, p.Nombre, c.Fecha, c.Hora from Citas c inner join Medicos m on c.idMedico = m.idMedico inner join Pacientes p on c.idPaciente = p.idPaciente ";
            reader = cmd.ExecuteReader();

            while (reader.Read()) 
            {
                CitasArregladas cita = new CitasArregladas();
                cita.IdCita = reader.GetInt32(0);
                cita.NombrePaciente = reader.GetString(2);
                cita.NombreMedico = reader.GetString(1);
                cita.Fecha = reader.GetDateTime(3).ToLongDateString();
                cita.Hora = reader.GetTimeSpan(4).ToString();
                salida.Add(cita);
            }
            cmd.Dispose();
            conexion.Close();
            return salida;
        }

        [Route("CrearCitas")]
        public IHttpActionResult PostCita(Citas cita, int idMedico, int idPaciente) 
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }
            cita.idMedico = idMedico;
            cita.idPaciente = idPaciente;

            db.Citas.Add(cita);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cita.idCita }, cita);
        }
    }
}
