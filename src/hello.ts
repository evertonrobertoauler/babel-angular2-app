import {Component, View} from 'angular2/angular2';
import {Greeter} from './services.ts';

@Component({
  selector: 'hello-app',
  injectables: [Greeter]
})
@View({template: `<p>{{message}}</p>`})
export class HelloApp {
  message:string;

  constructor(greeter:Greeter) {
    this.message = greeter.hello('Angular 2 app');
  }
}
