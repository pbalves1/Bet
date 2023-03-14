import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')
paginator = dynamo.get_paginator('query')


# https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/geteventslistbyhometeam

def findByAwayTeam(team):

    response = dynamo.query(
        TableName='events_betano',
        IndexName='awayTeam-startTime-index',
        KeyConditions={
            'awayTeam': {
                'AttributeValueList': [
                    {
                        'S': str(team)
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        },
        ScanIndexForward=False,
        Limit=25
    )

    return response

def findByHomeTeam(team):

    response = dynamo.query(
        TableName='events_betano',
        IndexName='homeTeam-startTime-index',
        KeyConditions={
            'homeTeam': {
                'AttributeValueList': [
                    {
                        'S': str(team)
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        },
        ScanIndexForward=False,
        Limit=25
    )

    return response


def lambda_handler(event, context):

    team = event['queryStringParameters']['team']
    itens = []
    respItens = {'homeEvents': [], 'events': []}


    response = findByHomeTeam(team)

    for item in response['Items']:
        itens.append(item)


    response = findByAwayTeam(team)

    for item in response['Items']:
        itens.append(item)


    for item in itens:
        print(item)
        dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))

        respItens['events'].append({"winBet": item['winBet']['S'],"correctScore": item['correctScore']['S'], "awayTeam": item['awayTeam']['S'], "homeTeam": item['homeTeam']['S'], "data": dt_obj.strftime("%d/%m %H:%M"), "timestamp": item['startTime']['N']})

        if item['homeTeam']['S'] == team:
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
