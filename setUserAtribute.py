import json
import boto3
import time

client = boto3.client('cognito-idp')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/setuseratribute



def lambda_handler(event, context):

    body = json.loads(event['body'])
    resposta = {'diasrestantes': 0}

    days = round(time.time()) + (int(body['d']) * 86400)
    print(days)


    response = client.update_user_attributes(
        UserAttributes=[
            {
                'Name': 'custom:vencimento',
                'Value': str(days)
            },
        ],
        AccessToken=body['acessToken']
    )


    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({})
    }
