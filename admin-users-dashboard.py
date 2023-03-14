import json
import boto3
from datetime import datetime

millisec = int((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds() * 1000)
millisec = int(str(millisec)[0:10])

# Endpoint de API: https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/admin/dashboard


def get_all_users():
    cognito = boto3.client('cognito-idp')

    users = []
    next_page = None
    kwargs = {
        'UserPoolId': "sa-east-1_bMPWeN4mX"
    }

    users_remain = True
    while(users_remain):
        if next_page:
            kwargs['PaginationToken'] = next_page
        response = cognito.list_users(**kwargs)
        users.extend(response['Users'])
        next_page = response.get('PaginationToken', None)
        users_remain = next_page is not None

    return users


def lambda_handler(event, context):

    dashboard = {'cadastros': 0, 'online': 0, 'vencidos': 0}
    allUsers = get_all_users()
    for user in allUsers:
        dashboard['cadastros'] += 1

        for userAttri in user['Attributes']:
            if userAttri['Name'] == 'custom:vencimento':
                if(int(userAttri['Value']) <= millisec):
                    dashboard['vencidos'] += 1

            if userAttri['Name'] == 'custom:last_login':
                if round(((int(millisec - int(userAttri['Value'])))/3600), 2) < 2:
                    dashboard['online'] += 1


    #print(allUsers)

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(dashboard)
    }
