import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AssistantListComponent } from './assistant-list/assistant-list.component';
import { LoginComponent } from './login/login.component';
import { LoginV2Component } from './loginv2/loginv2.component';

import { HomeComponent } from './home/home.component';
import { ApiService } from './shared/services/api.service';
import { LocalStorageService } from './shared/services/localstorage.service';
import { OddsComponent } from './odds/odds.component';
import { OverviewComponent } from './overview/overview.component';
import { NextgamesComponent } from './nextgames/nextgames.component';
import { JogosComponent } from './hoje/jogos/jogos.component';
import { ArtilheiroComponent } from './hoje/artilheiros/artilheiro.component';
import { CalculadoraComponent } from './hoje/calculadora/calculadora.component';
import { RankingComponent } from './hoje/ranking/ranking.component';
import { MaximaComponent } from './maxima/maxima.component';
import { HorarioComponent } from './horario/horario.component';

import { CadastroComponent } from './cadastrov2/cadastro.component';
import { CasaComponent } from './casa/casa.component'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AssistantService } from './shared/services/assistant/assistant.service';

import {MatDatepickerModule} from '@angular/material';
import { DateAdapter } from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';
import { LogoutComponent } from './logout/logout.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { RespostaPagamentoComponent } from './respostapagamento/respostapagamento.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    AssistantListComponent,
    LoginComponent,
    CadastroComponent,
    CasaComponent,
    HomeComponent,
    OddsComponent,
    OverviewComponent,
    NextgamesComponent,
    JogosComponent,
    ArtilheiroComponent,
    CalculadoraComponent,
    RankingComponent,
    MaximaComponent,
    HorarioComponent,
    LogoutComponent,
    PagamentoComponent,
    RespostaPagamentoComponent,
    LoginV2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  providers: [ApiService, LocalStorageService, AssistantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
