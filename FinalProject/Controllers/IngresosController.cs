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
        SqlConnection conexion = new SqlConnection();
        SqlCommand cmd = new SqlCommand();
        SqlDataReader dr;

        public List<IngresosArreglados> GetIngresos() 
        {
            List<IngresosArreglados> lista = new List<IngresosArreglados>();
            conexion.ConnectionString = "Data source=DESKTOP-KQ78R80\\SQLEXPRESSERLYN; database=SistemaMedico; integrated security=SSPI";
            conexion.Open();
            cmd.Connection = conexion;
            string query = "select i.idIngreso, p.Nombre, h.Numero, i.FechaIngreso from Ingresos i inner join Pacientes p on i.idPaciente = p.idPaciente inner join Habitaciones h on i.idHabitacion = h.idHabitacion";
            cmd.CommandText = query;
            dr = cmd.ExecuteReader();
            while (dr.Read()) 
            {
                IngresosArreglados ingreso = new IngresosArreglados();
                ingreso.idIngreso = dr.GetInt32(0);
                ingreso.NombrePaciente = dr.GetString(1);
                ingreso.NumeroHabitacion = dr.GetInt32(2);
                ingreso.FechaIngreso = dr.GetDateTime(3);
                lista.Add(ingreso);
            }
            cmd.Dispose();
            conexion.Close();
            return lista;
        }

        public IQueryable<Ingresos> GetIngresos2()
        {
            return db.Ingresos;
        }

        [ResponseType(typeof(Ingresos))]
        public IHttpActionResult PostIngresos(Ingresos ingreso) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime fecha = DateTime.Now;

            if (ingreso.FechaIngreso < fecha) 
            {
                return BadRequest("La fecha no puede ser menor a la actual");
            }
            else 
            { 
                db.Ingresos.Add(ingreso);
                db.SaveChanges();
            }
            return CreatedAtRoute("DefaultApi", new { id = ingreso.idIngreso }, ingreso);
        }

        [ResponseType(typeof(Ingresos))]

        public IHttpActionResult DeleteIngreso(int id, string tipo) 
        {
            conexion.ConnectionString = "data source = DESKTOP-KQ78R80\\SQLEXPRESSERLYN; integrated security = SSPI; database = SistemaMedico;";
            conexion.Open();
            cmd.Connection = conexion;
            switch (tipo) 
            {
                case "Paciente":
                    string query = "delete from Ingresos where idPaciente=" + id;
                    cmd.CommandText = query;
                    cmd.ExecuteNonQuery();
                    break;
                case "Habitacion":
                    string query1 = "delete from Ingresos where idHabitacion=" + id;
                    cmd.CommandText = query1;
                    cmd.ExecuteNonQuery();
                    break;
                case "Ingreso":
                    string query2 = "delete from Ingresos where idIngreso=" + id;
                    cmd.CommandText = query2;
                    cmd.ExecuteNonQuery();
                    break;
            }
            cmd.Dispose();
            conexion.Close();
            return Ok(id);
        }
    }
}
