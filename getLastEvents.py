import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')

# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/lastevents


def findDB(tsInicio, leagueId, lastKey):

    if lastKey:
        response = dynamo.scan(
            TableName='events_betano',
            ConditionalOperator='AND',
            ScanFilter={
                'startTime': {
                    'AttributeValueList': [
                        {
                            'N': str(int(tsInicio))+"000",
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
                },
                'winBet': {
                    'ComparisonOperator': 'NOT_NULL'
                }
            },
            ExclusiveStartKey=lastKey
        )

        return response
    else:
        response = dynamo.scan(
            TableName='events_betano',
            ConditionalOperator='AND',
            ScanFilter={
                'startTime': {
                    'AttributeValueList': [
                        {
                            'N': str(int(tsInicio))+"000",
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
                },
                'winBet': {
                    'ComparisonOperator': 'NOT_NULL'
                }
            },
        )

        return response



def lambda_handler(event, context):

    print(event)
    print(event['queryStringParameters'])
    leagueId = event['queryStringParameters']['leagueId']
    responseJson = []
    itens = []

    print('Loading function')
    datetime_object = datetime.now()
    ts = datetime_object.timestamp()
    print("Epoch do segundo do sistema: "+str(ts))
    tsInicio = ts - (3600*6)
    print("Epoch do segundo do sistema: "+str(tsInicio))

    response = findDB(tsInicio, leagueId, None)
    print(response)
    for item in response['Items']:
        itens.append(item)


    while 'LastEvaluatedKey' in response:
        response = findDB(tsInicio, leagueId, response['LastEvaluatedKey'])
        for item in response['Items']:
            itens.append(item)

    for item in itens:
        dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))

        hour = dt_obj.hour
        minute = dt_obj.minute
        if hour < 10:
            hour = "0"+str(hour)

        if minute < 10:
            minute = "0"+str(minute)

        score = item['correctScore']['S'].split('-')

        if 'participants' in item:
            responseJson.append({"winBet": item['winBet']['S'], "id": item['id']['S'], "homeTeamScore": score[0],"awayTeamScore": score[1], "startTime": item['startTime']['N'], "hour": str(hour)+":"+str(minute), "homeTeam": item['participants']['L'][0]['M']['name']['S'], "awayTeam": item['participants']['L'][1]['M']['name']['S']})

    responseJson.sort(reverse=True, key=lambda x: x["startTime"])

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(responseJson)
    }
