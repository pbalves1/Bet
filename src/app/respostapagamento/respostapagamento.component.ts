import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-respostapagamento',
  templateUrl: './respostapagamento.component.html',
  styleUrls: ['./respostapagamento.component.css']
})
export class RespostaPagamentoComponent implements OnInit {
  globa = {id: ''}
  pacotes = {1: 30, 2: 90, 3: 180}
  constructor(private apiService:ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  formShowing:boolean = false;

  errorMessage:string;
  

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(s => {
      console.log(s)
      //approved
      //http://localhost:4200/pagamento-resposta/1?collection_id=1269855871&collection_status=pending&payment_id=1269855871&status=pending&external_reference=null&payment_type=ticket&merchant_order_id=5017647915&preference_id=1011933126-f9772dd8-03a4-4549-9118-7676825374f2&site_id=MLB&processing_mode=aggregator&merchant_account_id=null
      if(s['preapproval_id']){
        this.apiService.setuseratribute(this.pacotes[1]).subscribe(
          data  => {
            console.log(data)
            this.router.navigate(['bookies']);
          },
          error => {
            console.log(error)
            alert('Erro ao processar resposta do pagamento, tente novamente')
            this.router.navigate(['renewal']);
          }
        );
      }else{
        alert('Pagamento Recusado: tente novamente');
        this.router.navigate(['renewal']);
      }
    });
  }

 
}
