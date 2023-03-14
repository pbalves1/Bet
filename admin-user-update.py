import json
import boto3
from datetime import datetime

millisec = int((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds() * 1000)
millisec = int(str(millisec)[0:10])
millisec = millisec + (86400 * 30)
client = boto3.client('cognito-idp')
# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/admin/user



def lambda_handler(event, context):

    body = json.loads(event['body'])

    response = client.admin_update_user_attributes(
        UserPoolId='sa-east-1_bMPWeN4mX',
        Username=body['email'],
        UserAttributes=[
            {
                'Name': 'custom:vencimento',
                'Value': str(millisec)
            },
        ]
    )



    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': ''
    }
