import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  public dateValue: Date = new Date();
  public todayDate: Date = new Date();
  findStampStart = 0;
  todasLigas = false;
  findStampEnd = 0;
  season: any;
  leagueId: any;
  bookie: any;
  horariosCopa: any;
  horariosChampions: any;
  horariosPremier: any;
  horariosTacage: any;
  horariosAmerica: any;
  horariosEstrelas: any;
  horariosItaliano: any;
  dataVencimento = new Date();
  mercado = 'RESULTADO FT'
  indicesCopa = ['01','04','07','10','13','16','19','22','25','28','31','34','37','40','43','46','49','52','55','58']
  indicesPremier = ['02','05','08','11','14','17','20','23','26','29','32','35','38','41','44','47','50','53','56','59']
  indicesChampions = ["00", "03", "06", "09", "12", "15", "18", "21", "24", "27", "30", "33", "36", "39", "42", "45", "48", "51", "54", "57"]
  mediaColunaCopa = {}
  mediaLinhaCopa = {}
  mediaColunaPremier = {}
  mediaLinhaPremier = {}
  mediaColunaChampions = {}
  mediaLinhaChampions = {}
  mediaColunaTacage = {}
  mediaLinhaTacage = {}
  mediaColunaAmerica = {}
  mediaLinhaAmerica = {}
  mediaColunaEstrelas = {}
  mediaLinhaEstrelas = {}
  mediaColunaItaliano = {}
  mediaLinhaItaliano = {}
  mercadoDesc = 'CASA'
  colorselect = [
    {'class': 'gold-select', 'ativo': false},
    {'class': 'antiquewhite-select', 'ativo': false},
    {'class': 'cyan-select', 'ativo': false},
    {'class': 'crimson-select', 'ativo': false},
    {'class': 'teal-select', 'ativo': false},
    {'class': 'orange-select', 'ativo': false},
    {'class': 'purple-select', 'ativo': false},
    {'class': 'blue-select', 'ativo': false}
  ]
  constructor(private dateAdapter: DateAdapter<Date>, private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
    this.dateAdapter.setLocale('en-GB');
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;

  errorMessage:string;

  toogleTodasLigas(){
    if(this.todasLigas){
      this.todasLigas = false
      localStorage.setItem('todasLigas', '0')
    }else{
      this.todasLigas = true
      localStorage.setItem('todasLigas', '1')
      this.find()
    }
  }

  selectSame(horarios, indicesTela, atual){

    if(atual){

      if(atual.selectClass == null){

        var colorDisponivel: any
        localStorage.setItem('same', atual);

        this.colorselect.forEach(color => {
          if(color.ativo == false){
            colorDisponivel = color
          }
        })

        if(!colorDisponivel){
          colorDisponivel = this.colorselect[0]
        }

        this.colorselect.forEach(color => {
          if(color == colorDisponivel){
            color['ativo'] = true
          }
        })

        atual.selectClass = colorDisponivel.class

        if(this.todasLigas){

          this.horariosCopa['indices_stamp'].forEach(element => {

            this.indicesCopa.forEach(id => {
              if(this.horariosCopa['values'][element['indice']][id]){
                if(this.horariosCopa['values'][element['indice']][id].score == atual.score){
                  this.horariosCopa['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosPremier['indices_stamp'].forEach(element => {

            this.indicesPremier.forEach(id => {
              if(this.horariosPremier['values'][element['indice']][id]){
                if(this.horariosPremier['values'][element['indice']][id].score == atual.score){
                  this.horariosPremier['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosChampions['indices_stamp'].forEach(element => {

            this.indicesChampions.forEach(id => {
              if(this.horariosChampions['values'][element['indice']][id]){
                if(this.horariosChampions['values'][element['indice']][id].score == atual.score){
                  this.horariosChampions['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosTacage['indices_stamp'].forEach(element => {

            this.indicesCopa.forEach(id => {
              if(this.horariosTacage['values'][element['indice']][id]){
                if(this.horariosTacage['values'][element['indice']][id].score == atual.score){
                  this.horariosTacage['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosAmerica['indices_stamp'].forEach(element => {

            this.indicesCopa.forEach(id => {
              if(this.horariosAmerica['values'][element['indice']][id]){
                if(this.horariosAmerica['values'][element['indice']][id].score == atual.score){
                  this.horariosAmerica['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosEstrelas['indices_stamp'].forEach(element => {

            this.indicesChampions.forEach(id => {
              if(this.horariosEstrelas['values'][element['indice']][id]){
                if(this.horariosEstrelas['values'][element['indice']][id].score == atual.score){
                  this.horariosEstrelas['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })

          this.horariosItaliano['indices_stamp'].forEach(element => {

            this.indicesPremier.forEach(id => {
              if(this.horariosItaliano['values'][element['indice']][id]){
                if(this.horariosItaliano['values'][element['indice']][id].score == atual.score){
                  this.horariosItaliano['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })
        }else{
          horarios['indices_stamp'].forEach(element => {

            indicesTela.forEach(id => {
              if(horarios['values'][element['indice']][id]){
                if(horarios['values'][element['indice']][id].score == atual.score){
                  horarios['values'][element['indice']][id].selectClass = colorDisponivel.class
                }
              }
            })
          })
        }
      }else{
        

        this.colorselect.forEach(color => {
          if(color.class == atual.selectClass){
            color['ativo'] = false
          }
        })

        atual.selectClass = null

        if(this.todasLigas){

          this.horariosCopa['indices_stamp'].forEach(element => {

            this.indicesCopa.forEach(id => {
              if(this.horariosCopa['values'][element['indice']][id]){
                if(this.horariosCopa['values'][element['indice']][id].score == atual.score){
                  this.horariosCopa['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosPremier['indices_stamp'].forEach(element => {

            this.indicesPremier.forEach(id => {
              if(this.horariosPremier['values'][element['indice']][id]){
                if(this.horariosPremier['values'][element['indice']][id].score == atual.score){
                  this.horariosPremier['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosChampions['indices_stamp'].forEach(element => {

            this.indicesChampions.forEach(id => {
              if(this.horariosChampions['values'][element['indice']][id]){
                if(this.horariosChampions['values'][element['indice']][id].score == atual.score){
                  this.horariosChampions['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosTacage['indices_stamp'].forEach(element => {

            this.indicesCopa.forEach(id => {
              if(this.horariosTacage['values'][element['indice']][id]){
                if(this.horariosTacage['values'][element['indice']][id].score == atual.score){
                  this.horariosTacage['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosAmerica['indices_stamp'].forEach(element => {

            this.horariosAmerica.forEach(id => {
              if(this.horariosAmerica['values'][element['indice']][id]){
                if(this.horariosAmerica['values'][element['indice']][id].score == atual.score){
                  this.horariosAmerica['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosEstrelas['indices_stamp'].forEach(element => {

            this.horariosEstrelas.forEach(id => {
              if(this.horariosEstrelas['values'][element['indice']][id]){
                if(this.horariosEstrelas['values'][element['indice']][id].score == atual.score){
                  this.horariosEstrelas['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })

          this.horariosItaliano['indices_stamp'].forEach(element => {

            this.horariosItaliano.forEach(id => {
              if(this.horariosItaliano['values'][element['indice']][id]){
                if(this.horariosItaliano['values'][element['indice']][id].score == atual.score){
                  this.horariosItaliano['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })
        }else{
          horarios['indices_stamp'].forEach(element => {

            indicesTela.forEach(id => {
              if(horarios['values'][element['indice']][id]){
                if(horarios['values'][element['indice']][id].score == atual.score){
                  horarios['values'][element['indice']][id].selectClass = null
                }
              }
            })
          })
        }
        
        
      }
    }

    
  }


  findEvents(league){

    var indicesTela = []


    if(league == 'copa'){
      var leagueId = 200039
      indicesTela = this.indicesCopa
    }else if(league == 'premier'){
      indicesTela = this.indicesPremier
      var leagueId = 195679
    }else if(league == 'champions'){
      indicesTela = this.indicesChampions
      var leagueId = 199330
    }else if(league == 'tacage'){
      indicesTela = this.indicesCopa
      var leagueId = 199959
    }else if(league == 'america'){
      indicesTela = this.indicesCopa
      var leagueId = 197476
    }else if(league == 'estrelas'){
      indicesTela = this.indicesChampions
      var leagueId = 199960
    }else if(league == 'italiano'){
      indicesTela = this.indicesPremier
      var leagueId = 199961
    }



    var v = null
    var m = 'casa'
          
    if(localStorage.getItem('m')){
      m = localStorage.getItem('m')
    }

    if(localStorage.getItem('v')){
      v = localStorage.getItem('v')
    }


    this.apiService.getEventsByStarttime(leagueId, this.findStampStart, this.findStampEnd).subscribe(
      data  => {

        console.log(data)


      if(league == 'tacage'){
        this.horariosTacage = data

        indicesTela.forEach(indice => {
          this.mediaColunaTacage[indice] = {"ativo": 0, "total": 0, "media": 0}
        })

        this.horariosTacage['indices_stamp'].forEach(element => {
          this.mediaColunaTacage[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
        })

        this.changeMercadoGeral(m, v, this.horariosTacage, this.mediaColunaTacage, this.mediaLinhaTacage, indicesTela)
  
      }else if(league == 'copa'){
          this.horariosCopa = data

          indicesTela.forEach(indice => {
            this.mediaColunaCopa[indice] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.horariosCopa['indices_stamp'].forEach(element => {
            this.mediaLinhaCopa[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosCopa, this.mediaColunaCopa, this.mediaLinhaCopa, indicesTela)



        }else if(league == 'america'){
          this.horariosAmerica = data

          indicesTela.forEach(indice => {
            this.mediaColunaAmerica[indice] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.horariosAmerica['indices_stamp'].forEach(element => {
            this.mediaLinhaAmerica[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosAmerica, this.mediaColunaAmerica, this.mediaLinhaAmerica, indicesTela)



        }else if(league == 'premier'){
          this.horariosPremier = data
          console.log(this.horariosPremier)

          indicesTela.forEach(indice => {
            this.mediaColunaPremier[indice] = {"ativo": 0, "total": 0, "media": 0}
          })

          console.log(this.mediaColunaPremier)

          this.horariosPremier['indices_stamp'].forEach(element => {
            this.mediaLinhaPremier[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosPremier, this.mediaColunaPremier, this.mediaLinhaPremier, indicesTela)


        }else if(league == 'champions'){
          this.horariosChampions = data
          console.log(this.horariosChampions)

          indicesTela.forEach(indice => {
            this.mediaColunaChampions[indice] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.horariosChampions['indices_stamp'].forEach(element => {
            this.mediaLinhaChampions[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosChampions, this.mediaColunaChampions, this.mediaLinhaChampions, indicesTela)


        }else if(league == 'estrelas'){
          this.horariosEstrelas = data

          indicesTela.forEach(indice => {
            this.mediaColunaEstrelas[indice] = {"ativo": 0, "total": 0, "media": 0}
          })


          this.horariosEstrelas['indices_stamp'].forEach(element => {
            this.mediaLinhaEstrelas[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosEstrelas, this.mediaColunaEstrelas, this.mediaLinhaEstrelas, indicesTela)

        }else if(league == 'italiano'){
          this.horariosItaliano = data

          indicesTela.forEach(indice => {
            this.mediaColunaItaliano[indice] = {"ativo": 0, "total": 0, "media": 0}
          })


          this.horariosItaliano['indices_stamp'].forEach(element => {
            this.mediaLinhaItaliano[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
          })

          this.changeMercadoGeral(m, v, this.horariosItaliano, this.mediaColunaItaliano, this.mediaLinhaItaliano, indicesTela)

        }

      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );
  }

  find(){

    if(this.todasLigas){
      this.findEvents('tacage')
      this.findEvents('premier')
      this.findEvents('champions')
      this.findEvents('copa')
      this.findEvents('america')
      this.findEvents('estrelas')
      this.findEvents('italiano')
    }else{
      this.findEvents(this.season)
    }

    
  }

  findByDate(){

    var teste = this.dateValue;
    teste.setHours(0)
    teste.setMinutes(0)
    teste.setSeconds(0)
    teste.setMilliseconds(0)

    this.findStampStart = (teste.getTime()/ 1000)

    var teste2 = this.dateValue;
    teste2.setHours(23)
    teste2.setMinutes(59)
    teste2.setSeconds(59)
    teste2.setMilliseconds(0)

  
    this.findStampEnd = (teste2.getTime()/ 1000)

    this.horariosCopa = []
    this.find()
  }

  reloadEvents(){

    var token = localStorage.getItem("token")
    console.log("Roloading")
    this.apiService.isTokenExpired(token).subscribe(
      data => {
        if(data['diasrestantes'] < 1){
          this.router.navigate(['renewal']);
        }else{
          var currenttimestamp = new Date().getTime();
          var onedayaftertimestamp=currenttimestamp+(86400000*data['diasrestantes']);//1 day=86400000 ms;
          this.dataVencimento = new Date(onedayaftertimestamp);
          
        }
      },
      error => {
        if(error){
          this.router.navigate(['login']);
        }
      }
    );

    
    var teste = new Date();
    teste.setMilliseconds(0)

    console.log(teste)

    this.findStampStart = (teste.getTime()/ 1000) - (3600 * 24)
    this.findStampEnd = (teste.getTime()/ 1000)

    this.route.params.subscribe(params => {
      this.season = params['season'];
      this.bookie = params['bookie'];
    })

    this.bookie = localStorage.getItem('bookie')

    if(localStorage.getItem('todasLigas') && localStorage.getItem('todasLigas') == '1'){
      this.todasLigas = true
    }

    if(localStorage.getItem('mercado')){
      this.mercado = localStorage.getItem('mercado')
    }else{
      this.mercado = 'RESULTADO FT'
    }

    this.find()

    setTimeout(()=>{
      this.reloadEvents();
    }, 30000);
  }
  

  ngOnInit() {

    var token = localStorage.getItem("token")
    
    this.apiService.isTokenExpired(token).subscribe(
      data => {
        if(data['diasrestantes'] < 1){
          this.router.navigate(['renewal']);
        }else{
          var currenttimestamp = new Date().getTime();
          var onedayaftertimestamp=currenttimestamp+(86400000*data['diasrestantes']);//1 day=86400000 ms;
          this.dataVencimento = new Date(onedayaftertimestamp);
          
        }
      },
      error => {
        if(error){
          this.router.navigate(['login']);
        }
      }
    );

    
    var teste = this.dateValue;
    teste.setMilliseconds(0)

    this.findStampStart = (teste.getTime()/ 1000) - (3600 * 24)
    this.findStampEnd = (teste.getTime()/ 1000)

    this.route.params.subscribe(params => {
      this.season = params['season'];
      this.bookie = params['bookie'];
    })

    this.bookie = localStorage.getItem('bookie')

    if(localStorage.getItem('todasLigas') && localStorage.getItem('todasLigas') == '1'){
      this.todasLigas = true
    }

    if(localStorage.getItem('mercado')){
      this.mercado = localStorage.getItem('mercado')
    }else{
      this.mercado = 'RESULTADO FT'
    }

    this.find()

    setTimeout(()=>{
      this.reloadEvents();
    }, 30000);

  }


  changeMercadoType(){
    localStorage.setItem('mercado', this.mercado)
  }

  changeMercadoGeral(mercado, valor, horarios, mediaColuna, mediaLinha, indicesTela){

    localStorage.setItem('m', mercado)
    localStorage.setItem('v', valor)

    indicesTela.forEach(indice => {
      mediaColuna[indice] = {"ativo": 0, "total": 0, "media": 0}
    })

    horarios['indices_stamp'].forEach(element => {
      mediaLinha[element['indice']] = {"ativo": 0, "total": 0, "media": 0}
    })


    horarios['indices_stamp'].forEach(element => {

      indicesTela.forEach(id => {
        if(horarios['values'][element['indice']][id]){

          mediaColuna[id].total = mediaColuna[id].total + 1
          mediaLinha[element['indice']].total = mediaLinha[element['indice']].total + 1

          if(mercado == 'casa'){
            if(horarios['values'][element['indice']][id].winBet == horarios['values'][element['indice']][id].homeTeam){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == 'fora'){
            
            if(horarios['values'][element['indice']][id].winBet == horarios['values'][element['indice']][id].awayTeam){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == 'empate'){
            if(horarios['values'][element['indice']][id].winBet == 'Empates'){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(valor && mercado == 'placar'){
            if(horarios['values'][element['indice']][id].score == valor){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "casa5"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            console.log(scores[0] + scores[1])

            if((parseInt(scores[0]) + parseInt(scores[1])) > 5 && horarios['values'][element['indice']][id].winBet == horarios['values'][element['indice']][id].homeTeam){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "fora5"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            console.log(scores[0] + scores[1])

            if((parseInt(scores[0]) + parseInt(scores[1])) > 5 && horarios['values'][element['indice']][id].winBet == horarios['values'][element['indice']][id].awayTeam){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "empate5"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            console.log(scores[0] + scores[1])

            if((parseInt(scores[0]) + parseInt(scores[1])) > 5 && horarios['values'][element['indice']][id].winBet == 'Empates'){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "over"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if((parseInt(scores[0]) + parseInt(scores[1])) > valor){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "under"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if((parseInt(scores[0]) + parseInt(scores[1])) < valor){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }
          
          if(mercado == "gols"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if((parseInt(scores[0]) + parseInt(scores[1])) == valor){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "golsmais"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if((parseInt(scores[0]) + parseInt(scores[1])) > 5){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(mercado == "nempate"){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if(parseInt(scores[0]) == 0 || parseInt(scores[1]) == 0){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          
          if(mercado == 'ambasmarcam'){

            var scores = horarios['values'][element['indice']][id].score.split("-");

            if(parseInt(scores[0]) > 0 && parseInt(scores[1]) > 0){
              horarios['values'][element['indice']][id].ativo = true
            }else{
              horarios['values'][element['indice']][id].ativo = false
            }
          }

          if(horarios['values'][element['indice']][id].ativo){
            mediaColuna[id].ativo = mediaColuna[id].ativo + 1
            mediaLinha[element['indice']].ativo = mediaLinha[element['indice']].ativo + 1
                
            mediaColuna[id].media = ((100 * mediaColuna[id].ativo) / mediaColuna[id].total).toFixed(0);
            mediaLinha[element['indice']].media = ((100 * mediaLinha[element['indice']].ativo) / mediaLinha[element['indice']].total).toFixed(0);
          }
          
        }
      })
      

    });

  }

  changeMercados(mercado, valor, desc){

    console.log(mercado)
    this.mercadoDesc = desc
    var indicesTela = []

    if(this.season == 'copa'){
      indicesTela = this.indicesCopa
    }else if(this.season == 'premier'){
      indicesTela = this.indicesPremier
    }else if(this.season == 'champions'){
      indicesTela = this.indicesChampions
    }else if(this.season == 'tacage'){
      indicesTela = this.indicesCopa
    }else if(this.season == 'america'){
      indicesTela = this.indicesCopa
    }else if(this.season == 'estrelas'){
      indicesTela = this.indicesChampions
    }else if(this.season == 'italiano'){
      indicesTela = this.indicesPremier
    }

    
    if(this.todasLigas){
      this.changeMercadoGeral(mercado, valor, this.horariosCopa, this.mediaColunaCopa, this.mediaLinhaCopa, this.indicesCopa)
      this.changeMercadoGeral(mercado, valor, this.horariosPremier, this.mediaColunaPremier, this.mediaLinhaPremier, this.indicesPremier)
      this.changeMercadoGeral(mercado, valor, this.horariosChampions, this.mediaColunaChampions, this.mediaLinhaChampions, this.indicesChampions)
      this.changeMercadoGeral(mercado, valor, this.horariosTacage, this.mediaColunaTacage, this.mediaLinhaTacage, this.indicesCopa)
      this.changeMercadoGeral(mercado, valor, this.horariosAmerica, this.mediaColunaAmerica, this.mediaLinhaAmerica, this.indicesCopa)
      this.changeMercadoGeral(mercado, valor, this.horariosEstrelas, this.mediaColunaEstrelas, this.mediaLinhaEstrelas, this.indicesChampions)
      this.changeMercadoGeral(mercado, valor, this.horariosItaliano, this.mediaColunaItaliano, this.mediaLinhaItaliano, this.indicesChampions)
    }else{
      if(this.season == 'copa'){
        this.changeMercadoGeral(mercado, valor, this.horariosCopa, this.mediaColunaCopa, this.mediaLinhaCopa, this.indicesCopa)
      }else if(this.season == 'premier'){
        this.changeMercadoGeral(mercado, valor, this.horariosPremier, this.mediaColunaPremier, this.mediaLinhaPremier, this.indicesPremier)
      }else if(this.season == 'champions'){
        this.changeMercadoGeral(mercado, valor, this.horariosChampions, this.mediaColunaChampions, this.mediaLinhaChampions, this.indicesChampions)
      }else if(this.season == 'tacage'){
        this.changeMercadoGeral(mercado, valor, this.horariosTacage, this.mediaColunaTacage, this.mediaLinhaTacage, this.indicesCopa)
      }else if(this.season == 'america'){
        this.changeMercadoGeral(mercado, valor, this.horariosAmerica, this.mediaColunaAmerica, this.mediaLinhaAmerica, this.indicesCopa)
      }else if(this.season == 'estrelas'){
        this.changeMercadoGeral(mercado, valor, this.horariosEstrelas, this.mediaColunaEstrelas, this.mediaLinhaEstrelas, this.indicesChampions)
      }else if(this.season == 'italiano'){
        this.changeMercadoGeral(mercado, valor, this.horariosItaliano, this.mediaColunaItaliano, this.mediaLinhaItaliano, this.indicesChampions)
      }
    }
    

  }

  showPadroes(){
    
  }

 
}
