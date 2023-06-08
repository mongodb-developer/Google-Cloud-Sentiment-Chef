import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantsListComponent } from './restaurants-list/restaurants-list.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';

const routes: Routes = [
  { path: 'restaurants', component: RestaurantsListComponent },
  { path: 'restaurants/:id', component: RestaurantDetailsComponent },
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
