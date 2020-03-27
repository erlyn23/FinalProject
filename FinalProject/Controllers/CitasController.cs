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
using FinalProject.Models;

namespace FinalProject.Controllers
{
    public class CitasController : ApiController
    {
        private SistemaMedicoEntities db = new SistemaMedicoEntities();
        
        [ResponseType(typeof(void))]
        [Route("AgregarCita")]
        public IHttpActionResult AddCita(Citas cita, Medicos medico, Pacientes paciente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            cita.idPaciente = paciente.idPaciente;
            cita.idMedico = medico.idMedico;

            db.Citas.Add(cita);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cita.idCita }, cita);
        }
    }
}
