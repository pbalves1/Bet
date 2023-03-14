import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

# https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/geteventsdashboardbyteams endpoint api

dynamo = boto3.client('dynamodb')

def finedByTeams(team1, team2, lastKey):

    if lastKey:
        response = dynamo.scan(
            TableName='events_betano',
            ConditionalOperator='AND',
            ScanFilter={
                'homeTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team2)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                },
                'awayTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team1)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
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
                'homeTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team2)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                },
                'awayTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team1)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                }
            }

        )

        return response


def lambda_handler(event, context):

    team1 = event['queryStringParameters']['team1']
    team2 = event['queryStringParameters']['team2']
    itens = []


    response = findByTeams(team1, team2, None)

    itens = response['Items']

    print(response)

    while 'LastEvaluatedKey' in response:
        response = findByTeams(team1, team2, response['LastEvaluatedKey'])
        print(response)
        itens.append(response['Items'])



    response = findByTeams(team2, team1, None)

    itens.append(response['Items'])

    print(response)

    while 'LastEvaluatedKey' in response:
        response = findByTeams(team1, team2, response['LastEvaluatedKey'])
        print(response)
        itens.append(response['Items'])


    return {
        'statusCode': 200,
        'body': json.dumps(itens)
    }
