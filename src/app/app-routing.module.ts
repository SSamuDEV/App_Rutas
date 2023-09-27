import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';

const routes: Routes = [
//{
//  path: '',
//  component: HomePageComponent
//},
{
  path: 'about',
  component: AboutPageComponent
},
{
  path: 'contact',
  component: ContactPageComponent
},
{
  path: 'countries',
  // El load children permite cargar rutas externas al módulo app sin necesidad de pasarlo por ahí,
  // en su contraparte, vamos al router principal y lo llamamos por su URL y si lo encuentra then
  // me cargas el Módulo.

  loadChildren: () => import('./countries/countries.module').then(modulo => modulo.CountriesModule),
},
{
  path: '**',
  redirectTo: 'countries'
},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]

})

export class AppRoutingModule { }
