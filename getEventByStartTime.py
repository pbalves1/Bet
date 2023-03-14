import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')


def lambda_handler(event, context):

    leagueId = event['queryStringParameters']['leagueId']
    responseJson = []

    print('Loading function')
    datetime_object = datetime.now()
    ts = datetime_object.timestamp()
    print("Epoch do segundo do sistema: "+str(ts))
    tsInicio = ts - (3600*24)
    print("Epoch do segundo do sistema: "+str(tsInicio))

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

    for item in response['Items']:
        dt_obj = datetime.fromtimestamp(int(item['startTime']['N'][0:10]) - (3600*3))
        print(item['participants'])
        hour = dt_obj.hour
        minute = dt_obj.minute
        if hour < 10:
            hour = "0"+str(hour)

        if minute < 10:
            minute = "0"+str(minute)

        score = item['correctScore']['S'].split('-')

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
