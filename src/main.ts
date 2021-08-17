import { sayHello } from './greet';
console.log(sayHello('typescript'));

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}
showHello('greeting','typescript');