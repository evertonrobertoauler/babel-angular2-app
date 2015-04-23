import 'babel-core/polyfill';
import { assert } from 'rtts_assert/rtts_assert';

import {bootstrap} from 'angular2/angular2';
import {HelloApp} from './hello.ts';
import {FormApp} from './form.ts';

bootstrap(HelloApp);
bootstrap(FormApp);
