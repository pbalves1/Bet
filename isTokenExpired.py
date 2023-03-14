import json
import boto3
import time

client = boto3.client('cognito-idp')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/istokenexpired


def lambda_handler(event, context):

    body = json.loads(event['body'])
    resposta = {'diasrestantes': 0}

    response = client.get_user(
        AccessToken=body['acessToken']
    )

    for attr in response['UserAttributes']:
        if attr['Name'] == 'custom:vencimento':
            teste = round((int(attr['Value']) - round(time.time())) / 86400)
            resposta['diasrestantes'] = teste
            print(teste)
    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(resposta)
    }
