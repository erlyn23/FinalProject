using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProject.Models
{
    public class CitasArregladas
    {
        public int IdCita { get; set; }
        public string NombrePaciente { get; set; }
        public string NombreMedico { get; set; }
        public string Fecha { get; set; }
        public string Hora { get; set; }
    }
}