import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/geteventslistbyteam


def findeByTeams(team, lastKey):

    if lastKey:
        response = dynamo.scan(
            TableName='events_betano',
            ConditionalOperator='OR',
            ScanFilter={
                'homeTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                },
                'awayTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team)
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
            ConditionalOperator='OR',
            ScanFilter={
                'homeTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                },
                'awayTeam': {
                    'AttributeValueList': [
                        {
                            'S': str(team)
                        },
                    ],
                    'ComparisonOperator': 'EQ'
                }
            }

        )

        return response


def lambda_handler(event, context):

    team = event['queryStringParameters']['team']
    itens = []


    response = findByTeams(team, None)

    itens = response['Items']

    print(response)

    while 'LastEvaluatedKey' in response:
        response = findByTeams(team, response['LastEvaluatedKey'])
        print(response)
        itens.append(response['Items'])


    return {
        'statusCode': 200,
        'body': json.dumps(itens)
    }
