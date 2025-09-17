import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreConceptsComponent } from './core-concepts.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoreConceptsComponent
      },
      {
        path: ':sectionId',
        component: CoreConceptsComponent
      }
    ])
  ]
})
export class CoreConceptsModule { }