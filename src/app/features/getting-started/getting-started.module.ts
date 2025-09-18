import { NgModule } from '@angular/core';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  imports: [
    GettingStartedComponent,
    GettingStartedRoutingModule
  ]
})
export class GettingStartedModule { }