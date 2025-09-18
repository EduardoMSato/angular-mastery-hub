import { NgModule } from '@angular/core';

import { FundamentalsComponent } from './fundamentals.component';
import { FundamentalsRoutingModule } from './fundamentals-routing.module';

@NgModule({
  imports: [
    FundamentalsComponent,
    FundamentalsRoutingModule
  ]
})
export class FundamentalsModule { }