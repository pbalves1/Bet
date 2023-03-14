import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/geteventslistbyteamsandhomewin


def findByHomeAndAwayTeam(homeTeam, awayTeam):
    response = dynamo.query(
        TableName='events_betano',
        IndexName='homeTeam-awayTeam-index',
        KeyConditions={
            'homeTeam': {
                'AttributeValueList': [
                    {
                        'S': str(homeTeam),
                    },
                ],
                'ComparisonOperator': 'EQ'
            },
            'awayTeam': {
                'AttributeValueList': [
                    {
                        'S': str(awayTeam),
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        },
        Limit=200
    )

    return response


def lambda_handler(event, context):

    team1 = event['queryStringParameters']['homeTeam']
    team2 = event['queryStringParameters']['awayTeam']
    itens = []
    respItens = {'homeEvents': [], 'events': []}

    #Busca jogos em Hometeam em casa
    response = findByHomeAndAwayTeam(team1, team2)
    for item in response['Items']:
        itens.append(item)


    #Busca jogos em Hometeam visitante

    response = findByHomeAndAwayTeam(team2, team1)
    for item in response['Items']:
        itens.append(item)


    for item in itens:
        print(item)
        dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))

        respItens['events'].append({"winBet": item['winBet']['S'],"correctScore": item['correctScore']['S'], "awayTeam": item['awayTeam']['S'], "homeTeam": item['homeTeam']['S'], "data": dt_obj.strftime("%d/%m %H:%M"), "timestamp": item['startTime']['N']})

        if item['homeTeam']['S'] == team1:
            respItens['homeEvents'].append({"winBet": item['winBet']['S'],"correctScore": item['correctScore']['S'], "awayTeam": item['awayTeam']['S'], "homeTeam": item['homeTeam']['S'], "data": dt_obj.strftime("%d/%m %H:%M"), "timestamp": item['startTime']['N']})


    respItens['events'].sort(reverse=True, key=lambda x: x["timestamp"])
    respItens['homeEvents'].sort(reverse=True, key=lambda x: x["timestamp"])

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(respItens)
    }
