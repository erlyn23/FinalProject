using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProject.Models
{
    public class IngresosArreglados
    {
        public int idIngreso { get; set; }
        public int idPaciente { get; set; }
        public string NombrePaciente { get; set; }
        public int NumeroHabitacion { get; set; }
        public string FechaIngreso { get; set; }
    }
}