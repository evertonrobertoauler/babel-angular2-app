import {Component, View, Attribute} from 'angular2/angular2';
import {Router, RouterOutlet} from 'angular2/router';
import {Greeter} from './services.ts';

@Component({
  selector: 'hello',
  injectables: [Greeter]
})
@View({
  template: `
    <p>{{message}}</p>
  `
})
class Hello {
  message:string;

  constructor(greeter: Greeter) {
    this.message = greeter.hello('Angular 2 App');
  }
}

@Component({
  selector: 'hello-app'
})
@View({
  directives: [Hello, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class HelloApp {
  constructor(router:Router) {
    router
      .config('/hello', Hello)
      .then((_) => router.navigate('/hello'))
  }
}
