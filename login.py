import json
import boto3
from datetime import datetime

millisec = int((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds() * 1000)
millisec = int(str(millisec)[0:10])

# https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/login

client = boto3.client('cognito-idp')

def lambda_handler(event, context):

    body = json.loads(event['body'])
    resposta = {'token': '', 'acessToken': ''}

    responseToken = client.initiate_auth(
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={"USERNAME": body['email'], "PASSWORD": body['senha']},
        ClientId='77u97373jlkk49oq1acg7rg8qg',
    )


    resposta['token'] = responseToken["AuthenticationResult"]["IdToken"]
    resposta['acessToken'] = responseToken["AuthenticationResult"]["AccessToken"]

    response = client.update_user_attributes(
        UserAttributes=[
            {
                'Name': 'custom:last_login',
                'Value': str(millisec)
            },
        ],
        AccessToken=resposta['acessToken']
    )

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(resposta)
    }
