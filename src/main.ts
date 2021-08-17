import { sayHello } from './greet';
console.log(sayHello('typescript'));

function hello(compiler: string) {
  console.log('hello ' + compiler);
}
hello('typescript');