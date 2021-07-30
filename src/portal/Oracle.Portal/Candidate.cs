using Oracle.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Oracle.Portal
{


    public class Candidate : Person
    {


    }

    public class Employee : Person
    {

        public int Salary { get; set; }

    }

    public static class PersonUtilities
    {

        public static string GetFullName(this Person person)
        {
            return person.FirstName + " " + person.LastName;
        }

    }

}
