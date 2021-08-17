// function greeter(person:string) {
//   return "Hello, " + person;
// }

// let user = [0, 1, 2];

// document.body.innerHTML = greeter(user);

// interface Persons {
//   firstName: string,
//   lastName: string,
// }
// function getPersons(persons: Persons) {
//   return persons.firstName + persons.lastName;
// }
// const test  = {
//   firstName: 'du',
//   lastName: "ruo",
// }
// const tes1t = getPersons(test);
// console.log(tes1t);

class Student {
  fullName: string;
  constructor(public firstName, public middleInitial, public lastName) {
      this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person : Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

console.log(greeter(user));
