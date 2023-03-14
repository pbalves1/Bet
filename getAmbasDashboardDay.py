import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/getambasdashboardday



def findDayBets(leagueId, millisec):

    response = dynamo.query(
        TableName='events_betano',
        IndexName='leagueId-startTime-index',
        KeyConditions={
            'leagueId': {
                'AttributeValueList': [
                    {
                        'S': str(leagueId)
                    },
                ],
                'ComparisonOperator': 'EQ'
            },
            'startTime': {
                'AttributeValueList': [
                    {
                        'N': str(millisec)
                    },
                ],
                'ComparisonOperator': 'GE'
            }
        },
    )

    return response


def lambda_handler(event, context):


    data_atual = datetime.today()
    data_atual = data_atual.replace(hour=00, minute=00, second=00)
    milliseconds_sinec_epoch = data_atual.timestamp() * 1000
    millisec = str(milliseconds_sinec_epoch).split(".")[0]
    print(millisec)

    leagueId = event['queryStringParameters']['leagueId']
    itens = []
    resposta = {'indices': [], 'classificacao': {}}


    response = findDayBets(leagueId, millisec)

    for item in response['Items']:

        if 'correctScore' in item:
            if item['homeTeam']['S'] not in resposta['classificacao']:
                resposta['classificacao'][item['homeTeam']['S']] = {}

            if item['awayTeam']['S'] not in resposta['classificacao']:
                resposta['classificacao'][item['awayTeam']['S']] = {}
                #classificacao.append(item['awayTeam']['S'])


            dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]))
            hour = dt_obj.hour

            indice = str(hour)
            if str(hour) not in resposta['indices']:
                resposta['indices'].append(str(hour))

            placar = item['correctScore']['S'].split("-")

            if str(hour) not in resposta['classificacao'][item['awayTeam']['S']]:
                resposta['classificacao'][item['awayTeam']['S']][indice] = 0
            if str(hour) not in resposta['classificacao'][item['homeTeam']['S']]:
                resposta['classificacao'][item['homeTeam']['S']][indice] = 0

            if 'total' not in resposta['classificacao'][item['awayTeam']['S']]:
                resposta['classificacao'][item['awayTeam']['S']]['total'] = 0

            if 'total' not in resposta['classificacao'][item['homeTeam']['S']]:
                resposta['classificacao'][item['homeTeam']['S']]['total'] = 0

            if 'totalambas' not in resposta['classificacao'][item['awayTeam']['S']]:
                resposta['classificacao'][item['awayTeam']['S']]['totalambas'] = 0

            if 'totalambas' not in resposta['classificacao'][item['homeTeam']['S']]:
                resposta['classificacao'][item['homeTeam']['S']]['totalambas'] = 0

            if 'totalambasHome' not in resposta['classificacao'][item['awayTeam']['S']]:
                resposta['classificacao'][item['awayTeam']['S']]['totalambasHome'] = 0

            if 'totalambasHome' not in resposta['classificacao'][item['homeTeam']['S']]:
                resposta['classificacao'][item['homeTeam']['S']]['totalambasHome'] = 0

            resposta['classificacao'][item['awayTeam']['S']]['total'] += 1
            resposta['classificacao'][item['homeTeam']['S']]['total'] += 1

            if int(placar[0]) > 0 and int(placar[1]) > 0:
                resposta['classificacao'][item['awayTeam']['S']][ indice] += 1
                resposta['classificacao'][item['homeTeam']['S']][indice] += 1
                resposta['classificacao'][item['awayTeam']['S']]['totalambas'] += 1

                resposta['classificacao'][item['homeTeam']['S']]['totalambas'] += 1
                resposta['classificacao'][item['homeTeam']['S']]['totalambasHome'] += 1



    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(resposta)
    }
