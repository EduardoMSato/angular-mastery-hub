import { NgModule } from '@angular/core';

import { CoreConceptsComponent } from './core-concepts.component';
import { CoreConceptsRoutingModule } from './core-concepts-routing.module';

@NgModule({
  imports: [
    CoreConceptsComponent,
    CoreConceptsRoutingModule
  ]
})
export class CoreConceptsModule { }