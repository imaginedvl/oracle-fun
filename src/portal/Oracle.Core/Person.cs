using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oracle.Core
{
    
    public class Person
    {

        public Guid Id => Guid.NewGuid();
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public int Age { get; set; }
    }

    public static class PersonExtensions
    {

        public static T SetName<T>(this T person, string firstName, string lastName)
            where T: Person
        {
            person.FirstName = firstName;
            person.LastName = lastName;
            return person;
        }
        public static T SetAge<T>(this T person, int age)
            where T: Person
        {
            person.Age = age;
            return person;
        }
    }


}