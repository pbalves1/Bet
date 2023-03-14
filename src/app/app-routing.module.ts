import { NgModule } from '@angular/core';
import { Routes, RouterModule,CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { LoginV2Component } from './loginv2/loginv2.component'
import { CadastroComponent } from './cadastrov2/cadastro.component'
import { CasaComponent } from './casa/casa.component'
import { HomeComponent } from './home/home.component'
import { OddsComponent } from './odds/odds.component';
import { OverviewComponent } from './overview/overview.component';
import { NextgamesComponent } from './nextgames/nextgames.component';
import { JogosComponent } from './hoje/jogos/jogos.component';
import { ArtilheiroComponent } from './hoje/artilheiros/artilheiro.component';
import { CalculadoraComponent } from './hoje/calculadora/calculadora.component';
import { RankingComponent } from './hoje/ranking/ranking.component';
import { MaximaComponent } from './maxima/maxima.component';
import { HorarioComponent } from './horario/horario.component';
import { LogoutComponent } from './logout/logout.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { RespostaPagamentoComponent } from './respostapagamento/respostapagamento.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login', data: { title: 'login' } },
  { path: 'login', component: LoginV2Component, data: { title: 'login' } },
  { path: 'cadastro', component: CadastroComponent, data: { title: 'cadastro' } },
  { path: 'bookies', component: CasaComponent, data: { title: 'bookies' } },
  { path: 'home', component: HomeComponent, data: { title: 'home' } },
  { path: 'odds/:season/:id', component: OddsComponent, data: { title: 'odds' } },
  { path: 'overview/:bookie/:season', component: OverviewComponent, data: { title: 'overview' } },
  { path: 'nextgames/:bookie/:season', component: NextgamesComponent, data: { title: 'nextgames' }  },
  //{ path: 'hoje/jogos', component: JogosComponent, data: { title: 'hoje/jogos' } },
  //{ path: 'hoje/artilheiro', component: ArtilheiroComponent },
  //{ path: 'hoje/calculadora', component: CalculadoraComponent },
  //{ path: 'hoje/ranking', component: RankingComponent },
  //{ path: 'maxima', component: MaximaComponent },
  { path: 'horario/:bookie/:season', component: HorarioComponent, data: { title: 'horario' } },
  { path: 'logout', component: LogoutComponent, data: { title: 'logout' } },
  { path: 'renewal', component: PagamentoComponent, data: { title: 'renewal' } },
  { path: 'pagamento-resposta', component: RespostaPagamentoComponent, data: { title: 'pagamento-resposta' }  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [LoginV2Component, CadastroComponent];
