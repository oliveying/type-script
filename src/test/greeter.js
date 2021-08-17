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
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
var user = new Student("Jane", "M.", "User");
console.log(greeter(user));
