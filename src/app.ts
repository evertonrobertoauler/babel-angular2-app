import 'babel-core/polyfill';

import {Component, View, bootstrap} from 'angular2/angular2';
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Injectable, Inject} from 'angular2/di';
import {Greeter} from './services.ts';

@Component({
  selector: 'hello-app',
  injectables: [Greeter]
})
@View({template: `<p>{{message}}</p>`})
class HelloApp {
  message:string;

  constructor(greeter:Greeter) {
    this.message = greeter.hello('Angular 2 app');
  }
}

@Component({selector: 'form-app'})
@View({
  template: `
  <div [control-group]="form">
    Full Name: <input control="fullName"><br />
    Username: <input control="username"><br />
    Favorite Color:<input control="favColor"><br />
  </div>
  {{ form.controls.fullName.value }}
  `,
  directives: [FormDirectives]
})
class FormApp {
  form:ControlGroup;

  constructor() {
    let builder = new FormBuilder();
    this.form = builder.group({
      fullName: ["", Validators.required],
      username: ["", Validators.required],
      favColor: [""]
    });
  }
}

bootstrap(HelloApp);
bootstrap(FormApp);
