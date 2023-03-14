import json
import boto3
from datetime import datetime

millisec = int((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds() * 1000)
millisec = int(str(millisec)[0:10])

# https://lo8qoiudbg.execute-api.sa-east-1.amazonaws.com/default/admin/users

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

    allUsers = get_all_users()
    usersResponse = []
    for user in allUsers:
        userResponse = {}
        for userAttri in user['Attributes']:
            if userAttri['Name'] == 'email':
                userResponse['email'] = userAttri['Value']
            if userAttri['Name'] == 'phone_number':
                userResponse['phone_number'] = userAttri['Value']
            if userAttri['Name'] == 'custom:vencimento':
                if(int(userAttri['Value']) > millisec):
                    userResponse['diasrestantes'] = round(((int(userAttri['Value']) - millisec)/86400), 2)

                if(int(userAttri['Value']) <= millisec):
                    userResponse['diasrestantes'] = "Vencido"

                userResponse['vencimento'] = userAttri['Value']
            if userAttri['Name'] == 'email_verified':
                userResponse['email_verified'] = userAttri['Value']

            if userAttri['Name'] == 'email_verified':
                if userAttri['Value'] == "true":
                    userResponse['email_verified'] = "Verdadeiro"
                else:
                    userResponse['email_verified'] = "Falso"

            if userAttri['Name'] == 'custom:last_login':
                userResponse['last_login'] = round(((int(millisec - int(userAttri['Value'])))/3600), 2)

            if userAttri['Name'] == 'sub':
                userResponse['sub'] = userAttri['Value']
           # if (userAttri['Name'] == 'custom:diasrestantes') and (userAttri['Value'] == "1"):

        if 'UserCreateDate' in user:
            userResponse['UserCreateDate'] = user['UserCreateDate'].strftime("%d/%m/%Y, %H:%M:%S")

        if 'UserLastModifiedDate' in user:
            userResponse['UserLastModifiedDate'] = user['UserLastModifiedDate'].strftime("%d/%m/%Y, %H:%M:%S")

        usersResponse.append(userResponse)

    #print(allUsers)

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(usersResponse)
    }
