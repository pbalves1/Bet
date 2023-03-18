from datetime import datetime
from html.parser import HTMLParser
import urllib.request
from urllib.parse import urlparse
from urllib.parse import parse_qs
import http.client
from botocore.config import Config
import boto3
import json
import time

my_config_dynamo= Config(
    region_name = 'sa-east-1',
)

clientDynamoDB = boto3.client('dynamodb',config=my_config_dynamo)

#
# Modelo de resposta do html do site https://vsa2.gambling-malta.com/vr-media-schedule/MediaViewer?sportType=FOOTBALL_MATCH&operator=betanolatam
#
class GamblingHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.scr = ''

    def handle_starttag(self, tag, attrs):
        if(tag == 'iframe'):
            print(attrs[1][1])
            self.scr = attrs[1][1]

class GamblingVideoHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.id = ''
        self.homeTeam = ''
        self.awayTeam = ''
        self.betTypeNameContainer = False
        self.correctTeam = False
        self.resultadoFinal = False
        self.winBet = ''
        self.correctScore = ''
        self.TTLGoal = ''
        self.underOver = ''


    def handle_starttag(self, tag, attrs):
        #print("Encountered a start tag:", tag)
        #print(attrs)
        #print(('id', 'homeTeamName') in attrs)
        if ('id', 'homeTeam') in attrs:
            self.id = 'homeTeam'
        if ('id', 'awayTeam') in attrs:
            self.id = 'awayTeam'
        if ('id', 'winBet') in attrs:
            self.id = 'winBet'
        if ('id', 'correctScore') in attrs:
            self.id = 'correctScore'
        if ('id', 'TTLGoal') in attrs:
            self.id = 'TTLGoal'
        if ('id', 'UnderOver') in attrs:
            self.id = 'UnderOver'
        if ('id', 'betTypeNameContainer') in attrs:
            self.betTypeNameContainer = True
        if ('id', 'payoutContainer') in attrs:
            self.betTypeNameContainer = False

    def handle_data(self, data):
        #print("Encountered some data  :", data)
        if(self.id == 'homeTeam'):
            print('Time da casa no Video: '+data)
            # Dicionario Betano x Gambling

            self.homeTeam = data
            self.id = ''
        if(self.id == 'awayTeam'):
            print('Time Visitante no Video: '+data)
            self.awayTeam = data
            self.id = ''
        if(self.id == 'winBet' and self.betTypeNameContainer):
            print('winBet: '+data)
            self.resultadoFinal = True
            self.winBet = data
            self.id = ''
        if(self.id == 'correctScore' and self.betTypeNameContainer):
            print('correctScore: '+data)
            self.resultadoFinal = True
            self.correctScore = data
            self.id = ''
        if(self.id == 'TTLGoal' and self.betTypeNameContainer):
            print('TTLGoal: '+data)
            self.resultadoFinal = True
            self.TTLGoal = data
            self.id = ''
        if(self.id == 'UnderOver' and self.betTypeNameContainer):
            print('UnderOver: '+data)
            self.resultadoFinal = True
            self.underOver = data
            self.id = ''

def findDBByTimestamp(timestamp):

    print(str(int(timestamp))+"000")

    # Busca jogo que iniciou no minuto atual
    response = clientDynamoDB.query(
        TableName='events_betano',
        IndexName='startTime-leagueId-index',
        KeyConditions={
            'startTime': {
                'AttributeValueList': [
                    {
                        'N': str(int(timestamp))+"000",
                    },
                ],
                'ComparisonOperator': 'EQ'
            },
            'leagueId': {
                'AttributeValueList': [
                    {
                        'S': '195679',
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        }
    )

    return response

def findDBById(id):


    # Busca jogo que iniciou no minuto atual
    response = clientDynamoDB.query(
        TableName='events_betano',
        KeyConditions={
            'id': {
                'AttributeValueList': [
                    {
                        'S': id,
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        }
    )

    return response

def getVideo(homeTeam, awayTeam, idVideo):
    conn = http.client.HTTPSConnection("vsmv.gambling-malta.com")
    payload = ''
    headers = {
    'authority': 'vsmv.gambling-malta.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'cookie': 'sticky=stx76.701',
    'pragma': 'no-cache',
    'referer': 'https://vsmv.gambling-malta.com/media/viewer/vanilla/vanilla-viewer.php?userId=1&operator=betanolatam&eventId='+str(idVideo),
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    }
    conn.request("GET", "/media/viewer/vanilla/vanilla-viewer.php?userId=1&operator=BetanoBR&eventId="+str(idVideo), payload, headers)
    res = conn.getresponse()
    data = res.read()
    parser = GamblingVideoHTMLParser()
    parser.feed(data.decode("utf-8"))


    if(parser.homeTeam == homeTeam or parser.awayTeam == awayTeam):
        parser.correctTeam = True

    return parser

def lambda_handler(event, context):

    # Pega o tempo atual via Epoch e zera os segundos/microsecond
    datetime_object = datetime.now()
    itemDynamo = {}
    apiCallTry = True
    responseNextItem = {}
    ts = datetime_object.timestamp()
    print("Epoch do segundo do sistema: "+str(ts))

    datetime_object = datetime_object.replace(second=0, microsecond=0)
    ts = datetime_object.timestamp()
    print("Epoch com segundo zero: "+str(ts))


    #Busca jogos em Hometeam em casa
    response = findDBByTimestamp(ts)
    print(response['Items'])
    if(response['Items']):
        responseItem = findDBById(response['Items'][0]['id']['S'])

        resp = findDBById(str(int(response['Items'][0]['id']['S'])+1))
        if(resp['Items']):
            responseNextItem = resp['Items'][0]

        if(responseItem['Items']):
            itemDynamo = responseItem['Items'][0]

    if 'id' in itemDynamo:
        print("Id do jogo no Betano: "+itemDynamo['id']['S'])

        itemDynamo['homeTeam'] = itemDynamo['participants']['L'][0]['M']['name']
        itemDynamo['awayTeam'] = itemDynamo['participants']['L'][1]['M']['name']
        print("Time da casa no Betano: "+itemDynamo['participants']['L'][0]['M']['name']['S'])
        print("Time Visitante no Betano: "+itemDynamo['participants']['L'][1]['M']['name']['S'])

        #if contentJson['data']['currentEvents'][0]['liveNow']:

        #salva infos no DB
        #tableEventsBetano.put_item(Item=contentJson['data']['currentEvent'])
        time.sleep(10)

        #se o evento estiver sendo transmitido, abre o video do jogo para analise
        conn = http.client.HTTPSConnection("vsa2.gambling-malta.com")
        payload = ''
        headers = {
        'authority': 'br.betano.com',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'cookie': 'sticky=stx69.008; lc-session=1; _gaexp=GAX1.2.FnkVn1LTRv-cMralcZkEDg.19242.1; siteid=undefined; sb_landing=true; _gid=GA1.2.1791170820.1654868793; _fbp=fb.1.1654868793284.721434669; _clck=x287lk|1|f27|0; sb_liveSport=FOOT; sb_cookieConsent=true; sb_virtualsCollapsedSport=; _ga=GA1.2.1815596495.1654868793; _clsk=986l3s|1654895423970|2|0|n.clarity.ms/collect; MgidSensorNVis=19; MgidSensorHref=https://br.betano.com/virtuals/futebol/; _ga_CHR7RP8E7T=GS1.1.1654895424.5.0.1654895424.60',
        'pragma': 'no-cache',
        'referer': 'https://br.betano.com/virtuals/futebol/',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        }

        conn.request("GET", "/vr-media-schedule/MediaViewer?sportType=FOOTBALL_MATCH&operator=BetanoBR", payload, headers)
        res = conn.getresponse()
        data = res.read()

        print(data)

        parser = GamblingHTMLParser()
        parser.feed(data.decode("utf-8"))
        print(parser.scr)
        parsed_url = urlparse(parser.scr)
        captured_value = parse_qs(parsed_url.query)['eventId'][0]
        print("Id Video no Gambling: "+captured_value)

        video = getVideo(itemDynamo['participants']['L'][0]['M']['name']['S'], itemDynamo['participants']['L'][1]['M']['name']['S'], captured_value)

        #if(captured_value.homeTeam == contentJson['data']['currentEvent']['participants'][0]['name'] and parser.awayTeam == contentJson['data']['currentEvent']['participants'][1]['name']):
        # Se o time for o correto
        if(video.correctTeam):


            # Aguardando jogo terminar
            while video.resultadoFinal == False:
                print ("Start : %s" % time.ctime())
                time.sleep(10)
                print ("End : %s" % time.ctime())
                video = getVideo(itemDynamo['participants']['L'][0]['M']['name']['S'], itemDynamo['participants']['L'][1]['M']['name']['S'], captured_value)
                print(video)

            #Corrigindo dicionario dos times
            if(video.winBet == 'Ecuador'):
                video.winBet = 'Equador'

            if(video.winBet[0:3] == 'Col'):
                video.winBet = 'Colombia'

            #Salvando Informações no DynamoDb

            itemDynamo['winBet'] =  {'S': video.winBet}
            itemDynamo['correctScore'] =  {'S': video.correctScore}
            itemDynamo['TTLGoal'] =  {'S': video.TTLGoal}
            itemDynamo['UnderOver'] =  {'S': video.underOver}
            itemDynamo['captured_value'] = {'S': captured_value}

            print(itemDynamo['winBet'])

            print(itemDynamo)

            response = clientDynamoDB.put_item(
                TableName='events_betano',
                Item=itemDynamo
            )

            #notificaca0HubTrigguerPadroes({"eventId": itemDynamo['id']['S'], "startTime": ts, "leagueId": "197476", "winBet": video.winBet, "correctScore": video.correctScore, "ttlGoal": video.TTLGoal, "underOver": video.underOver, "homeTeam": itemDynamo['homeTeam']['S'], "awayTeam": itemDynamo['awayTeam']['S']})

            #print(responseNextItem)

            #if 'id' in responseNextItem:
                #   nextVideo = getVideo(responseNextItem, str(int(captured_value) + 1))
                #  print(nextVideo)

            print(response)
        else:
            print("Time não confere")
