import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/nextevents


def findDBByDateAndLeague(ts, leagueId):

    response = dynamo.query(
        TableName='events_betano',
        IndexName='leagueId-startTime-index',
        KeyConditions={
            'startTime': {
                'AttributeValueList': [
                    {
                        'N': str(int(ts))+"000",
                    },
                ],
                'ComparisonOperator': 'GE'
            },
            'leagueId': {
                'AttributeValueList': [
                    {
                        'S': str(leagueId),
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        }
    )

    return response

def lambda_handler(event, context):

    print(event)

    responseJson = []
    leagueId = event['queryStringParameters']['leagueId']

    print(leagueId)

    itens = []

    print('Loading function')
    datetime_object = datetime.now()
    ts = datetime_object.timestamp()
    print("Epoch do segundo do sistema: "+str(ts))

    response = findDBByDateAndLeague(ts, leagueId)
    print(response)
    for item in response['Items']:
        itens.append(item)

    for item in itens:
        dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))

        if(item['participants']['L'][0]['M']['name']['S'][0:3] == 'Col'):
            item['participants']['L'][0]['M']['name']['S'] = 'Colombia'
        if(item['participants']['L'][1]['M']['name']['S'][0:3] == 'Col'):
            item['participants']['L'][1]['M']['name']['S'] = 'Colombia'

        hour = dt_obj.hour
        minute = dt_obj.minute
        if hour < 10:
            hour = "0"+str(hour)

        if minute < 10:
            minute = "0"+str(minute)

        responseJson.append({"id": item['id']['S'], "startTime": item['startTime']['N'], "hour": str(hour)+":"+str(minute), "homeTeam": item['participants']['L'][0]['M']['name']['S'], "awayTeam": item['participants']['L'][1]['M']['name']['S']})

    responseJson.sort(key=lambda x: x["startTime"])

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(responseJson)
    }
