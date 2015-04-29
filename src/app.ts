import 'babel-core/polyfill';
import {assert} from 'rtts_assert/rtts_assert';

import {bootstrap} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';
import {Pipeline} from 'angular2/src/router/pipeline';
import {HelloApp} from './hello.ts';
import {FormApp} from './form.ts';
import {bind} from 'angular2/di';

bootstrap(FormApp);

bootstrap(HelloApp, [
  bind(Router).toValue(new RootRouter(new Pipeline()))
]);
