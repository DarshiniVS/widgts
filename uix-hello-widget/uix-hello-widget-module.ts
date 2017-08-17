import { NgModule } from '@angular/core';
import { MdExpansionModule } from '@angular/material';
import { UixHelloWidgetComponent } from './uix-hello-widget.component';
////import { UixCustomerProfileAPIDemoComponent } from './uix-customer-profile.component-api';
//import { UixCustomerProfileDemoComponent } from './uix-customer-profile.component-demo';
import { UixHelloWidgetService } from './uix-hello-widget-service';
@NgModule({
  declarations: [],
  exports: [],
  imports: [],
  providers: [UixHelloWidgetService]
})
export class UixCustomerProfileModule {}
