﻿using System;
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
    [RoutePrefix("api/Ingresos")]
    public class IngresosController : ApiController
    {
        private SistemaMedico1Entities db = new SistemaMedico1Entities();
        private SqlConnection conexion = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        private SqlDataReader dr;

        public void Conexion()
        {
            conexion.ConnectionString = "Data source=DESKTOP-KQ78R80\\SQLEXPRESSERLYN; database=SistemaMedico1; integrated security=SSPI";
        }
        public List<IngresosArreglados> GetIngresos() 
        {
            try
            {
                List<IngresosArreglados> lista = new List<IngresosArreglados>();
                Conexion();
                conexion.Open();
                cmd.Connection = conexion;
                string query = "select i.idIngreso, p.idPaciente, p.Nombre, h.Numero, i.FechaIngreso from Ingresos i inner join Pacientes p on i.idPaciente = p.idPaciente inner join Habitaciones h on i.idHabitacion = h.idHabitacion left join AltaMedica a on i.idIngreso = a.idIngreso where a.idIngreso is null";
                cmd.CommandText = query;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    IngresosArreglados ingreso = new IngresosArreglados();
                    ingreso.idIngreso = dr.GetInt32(0);
                    ingreso.idPaciente = dr.GetInt32(1);
                    ingreso.NombrePaciente = dr.GetString(2);
                    ingreso.NumeroHabitacion = dr.GetInt32(3);
                    ingreso.FechaIngreso = dr.GetDateTime(4);
                    lista.Add(ingreso);
                }
                cmd.Dispose();
                conexion.Close();
                return lista;
            }
            catch(Exception e) 
            {
                return null;
            }
        }

        [Route("Ingresos2")]
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

            try
            {
               
                if (string.IsNullOrEmpty(ingreso.idPaciente.ToString()) || string.IsNullOrEmpty(ingreso.idHabitacion.ToString()) || string.IsNullOrEmpty(ingreso.FechaIngreso.ToString()))
                {
                    return BadRequest("No se aceptan campos nulos");
                }
                else
                {
                    db.Ingresos.Add(ingreso);
                    db.SaveChanges();
                    return CreatedAtRoute("DefaultApi", new { id = ingreso.idIngreso }, ingreso);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [ResponseType(typeof(Ingresos))]

        public IHttpActionResult DeleteIngreso(int id, string tipo) 
        {
            try 
            {
                Conexion();
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
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
