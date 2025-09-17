import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GettingStartedComponent } from './getting-started.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: GettingStartedComponent
      },
      {
        path: ':sectionId',
        component: GettingStartedComponent
      }
    ])
  ]
})
export class GettingStartedModule { }