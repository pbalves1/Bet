import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')

# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/getevents24hours


def findDB(startTime, endTime, leagueId):

    response = dynamo.query(
        TableName='events_betano',
        IndexName='leagueId-startTime-index',
        KeyConditions={
            'startTime': {
                'AttributeValueList': [
                    {
                        'N': str(int(startTime))+"000"
                    },
                    {
                        'N': str(int(endTime))+"000"
                    }
                ],
                'ComparisonOperator': 'BETWEEN'
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

    leagueId = event['queryStringParameters']['leagueId']
    startTime = event['queryStringParameters']['start']
    endTime = event['queryStringParameters']['end']
    responseJson = {"indices": [], "values": {}, "indices_stamp": []}
    itens = []

    print(leagueId)
    print(startTime)
    print(endTime)

    response = findDB(startTime, endTime, leagueId)
    print(response)
    for item in response['Items']:
        itens.append(item)


    for item in itens:

        if 'winBet' in item:
            dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))
            hour = dt_obj.hour
            minute = dt_obj.minute

            if hour < 10:
                hour = "0"+str(hour)

            if minute < 10:
                minute = "0"+str(minute)

            indice = str(dt_obj.day) + str(hour)
            indice = int(indice)

            if hour == 12 and leagueId == '197476':
                if minute == '03':
                    minute = '04'
                elif minute == '05':
                    minute = '07'
                elif minute == '07':
                    minute = '10'
                elif minute == '09':
                    minute = '13'
                elif minute == 11:
                    minute = 16
                elif minute == 13:
                    minute = 19
                elif minute == 15:
                    minute = 22
                elif minute == 17:
                    minute = 25
                elif minute == 19:
                    minute = 28
                elif minute == 21:
                    minute = 31
                elif minute == 23:
                    minute = 34
                elif minute == 25:
                    minute = 37
                elif minute == 27:
                    minute = 40
                elif minute == 29:
                    minute = 43
                elif minute == 31:
                    minute = 46
                elif minute == 33:
                    minute = 49
                elif minute == 35:
                    minute = 52
                elif minute == 37:
                    minute = 55
                elif minute == 39:
                    minute = 58

            if(indice not in responseJson['indices']):
                responseJson['indices'].append(indice)
                responseJson['indices_stamp'].append({"indice": indice, "stamp": item['startTime']['N'], "hour": hour})
                responseJson['values'][indice] = {}

            responseJson['values'][indice][minute] = {"winBet": item['winBet']['S'], "id": item['id']['S'], "score": item['correctScore']['S'], "startTime": item['startTime']['N'], "date": dt_obj.strftime("%d/%m"), "hour": str(hour)+":"+str(minute), "homeTeam": item['homeTeam']['S'], "awayTeam": item['awayTeam']['S']}


    responseJson['indices_stamp'].sort(reverse=True, key=lambda x: x["stamp"])


    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(responseJson)
    }
