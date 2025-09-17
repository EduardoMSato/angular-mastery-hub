import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FundamentalsComponent } from './fundamentals.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FundamentalsComponent
      },
      {
        path: ':sectionId',
        component: FundamentalsComponent
      }
    ])
  ]
})
export class FundamentalsModule { }