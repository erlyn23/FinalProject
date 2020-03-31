using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProject.Models
{
    public class AltaArreglada
    {
        public int idAltaMedica { get; set; }
        public string NombrePaciente { get; set; }
        public DateTime FechaIngreso { get; set; }
        public DateTime FechaSalida { get; set; }
        public decimal Monto { get; set; }
    }
}