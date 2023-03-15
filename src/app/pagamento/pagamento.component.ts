import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css']
})
export class PagamentoComponent implements OnInit {
  globa = {id: ''}
  constructor(private dateAdapter: DateAdapter<Date>, private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
  }

  formShowing:boolean = false;

  errorMessage:string;

  callMeli(number) {
    if (number == 1) {
      window.location.href = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c93808486ded3a10186e1c5c87e0158";
    }
    if (number == 3){
      window.location.href ="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c93808486dab2050186e1c99cd40433"
    }
    if (number == 6){
      window.location.href ="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c93808486dfe74f0186e1cbcc940133"
    }

  }

  ngOnInit(): void {

  }
}
