import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieCardComponent } from './movie-card/movie-card.component';

const routes: Routes = [
  { path: 'movies', component: MovieCardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}