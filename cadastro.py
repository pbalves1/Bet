import json
import boto3

client = boto3.client('cognito-idp')


def lambda_handler(event, context):

    print(event['body'])
    body = json.loads(event['body'])
    print(body['email'])

# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/cadastro

    #email = event['queryStringParameters']['email']
    #senha = event['queryStringParameters']['senha']
    #celular event['queryStringParameters']['senha']

    response = client.sign_up(
        ClientId='77u97373jlkk49oq1acg7rg8qg',
        Username=body['email'],
        Password=body['senha'],
        UserAttributes=[
            {
                'Name': 'phone_number',
                'Value': '+41988727578'
            },
            {
                'Name': 'custom:diasrestantes',
                'Value': "0"
            }
        ]
    )

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps('Hello from Lambda!')
    }
