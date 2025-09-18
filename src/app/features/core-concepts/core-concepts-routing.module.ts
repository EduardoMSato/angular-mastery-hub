import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreConceptsComponent } from './core-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: CoreConceptsComponent
  },
  {
    path: ':sectionId',
    component: CoreConceptsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreConceptsRoutingModule { }