import {Component, View} from 'angular2/angular2';
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';

@Component({
  selector: 'form-app',
  injectables: [FormBuilder]
})
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
export class FormApp {
  form:ControlGroup;

  constructor(builder: FormBuilder) {
    this.form = builder.group({
      fullName: ["", Validators.required],
      username: ["", Validators.required],
      favColor: [""]
    });
  }
}
