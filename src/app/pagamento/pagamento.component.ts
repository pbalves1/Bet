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

  callMeli(){
    window.location.href = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c938084869290d0018694c9c4cf01a7";  
  }
  

  ngOnInit(): void {
    
  }

 
}
