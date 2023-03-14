import boto3
import json
from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

dynamo = boto3.client('dynamodb')

def findByHomeAndAwayTeam(homeTeam, awayTeam):
    response = dynamo.query(
        TableName='events_betano',
        IndexName='homeTeam-awayTeam-index',
        KeyConditions={
            'homeTeam': {
                'AttributeValueList': [
                    {
                        'S': str(homeTeam),
                    },
                ],
                'ComparisonOperator': 'EQ'
            },
            'awayTeam': {
                'AttributeValueList': [
                    {
                        'S': str(awayTeam),
                    },
                ],
                'ComparisonOperator': 'EQ'
            }
        },
    )

    return response

def lambda_handler(event, context):

    homeTeam = event['queryStringParameters']['homeTeam']
    awayTeam = event['queryStringParameters']['awayTeam']
    itens = []
    respJogos = 0
    respHomeWin = 0
    respAwayWin = 0
    respEmpates = 0
    respHomeGols = 0
    respAwayGols = 0
    respOver1_5 = 0
    respOver2_5 = 0
    respOver3_5 = 0
    respOver4_5 = 0
    respAmbas = 0
    respHomeTeamJogos = 0
    respHomeTeamHomeWin = 0
    respHomeTeamAwayWin = 0
    respHomeTeamEmpates = 0
    respHomeTeamHomeGols = 0
    respHomeTeamAwayGols = 0
    respHomeTeamOver1_5 = 0
    respHomeTeamOver2_5 = 0
    respHomeTeamOver3_5 = 0
    respHomeTeamOver4_5 = 0
    respHomeTeamAmbas = 0

    print('Loading function')
    datetime_object = datetime.now()
    ts = datetime_object.timestamp()
    print("Epoch do segundo do sistema: "+str(ts))



    response = findByHomeAndAwayTeam(homeTeam, awayTeam)

    for item in response['Items']:
        itens.append(item)

    respHomeTeamJogos = response['Count']

    response = findByHomeAndAwayTeam(awayTeam, homeTeam)

    for item in response['Items']:
        itens.append(item)

    respJogos = len(itens)

    for item in itens:
        if 'winBet' in item and item['winBet']['S'] == homeTeam:
            respHomeWin += 1
            if item['homeTeam']['S'] == homeTeam:
                respHomeTeamHomeWin += 1
        if 'winBet' in item and item['winBet']['S'] == awayTeam:
            respAwayWin += 1
            if item['homeTeam']['S'] == homeTeam:
                respHomeTeamAwayWin += 1
        if 'winBet' in item and item['winBet']['S'] == 'Empates':
            respEmpates += 1
            if item['homeTeam']['S'] == homeTeam:
                respHomeTeamEmpates += 1
        if item['correctScore']['S']:
            x = item['correctScore']['S'].split("-")
            respHomeGols = respHomeGols + int(x[0])
            if item['homeTeam']['S'] == homeTeam:
                 respHomeTeamHomeGols = respHomeTeamHomeGols + int(x[0])
            respAwayGols = respAwayGols + int(x[1])
            if item['homeTeam']['S'] == homeTeam:
                 respHomeTeamAwayGols = respHomeTeamAwayGols + int(x[0])
            gols = int(x[0]) + int(x[1])
            if gols > 1:
                respOver1_5 += 1
                if item['homeTeam']['S'] == homeTeam:
                    respHomeTeamOver1_5 += 1
            if gols > 2:
                respOver2_5 += 1
                if item['homeTeam']['S'] == homeTeam:
                    respHomeTeamOver2_5 += 1
            if gols > 3:
                respOver3_5 += 1
                if item['homeTeam']['S'] == homeTeam:
                    respHomeTeamOver3_5 += 1
            if gols > 4:
                respOver4_5 += 1
                if item['homeTeam']['S'] == homeTeam:
                    respHomeTeamOver4_5 += 1
            if x[0] == x[1]:
                respAmbas += 1
                if item['homeTeam']['S'] == homeTeam:
                    respHomeTeamAmbas += 1



    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        #'body': json.dumps(response)
        'body': json.dumps({"homeTeamAmbas": respHomeTeamAmbas, "homeTeamOver4_5": respHomeTeamOver4_5,"homeTeamOver3_5": respHomeTeamOver3_5,"homeTeamOver2_5": respHomeTeamOver2_5,"homeTeamOver1_5": respHomeTeamOver1_5,  "homeTeamAwayGols": respHomeTeamAwayGols, "homeTeamHomeGols": respHomeTeamHomeGols, "homeTeamEmpates": respHomeTeamEmpates, "homeTeamAwayWin": respHomeTeamAwayWin, "homeTeamHomeWin": respHomeTeamHomeWin, "homeTeamJogos": respHomeTeamJogos, "ambas": respAmbas, "over4_5": respOver4_5, "over3_5": respOver3_5,"over2_5": respOver2_5, "jogos": respJogos, "homeWin": respHomeWin, "awaywin": respAwayWin, "empates": respEmpates, "homeGols": respHomeGols, "awayGols": respAwayGols, "over1_5": respOver1_5})
    }
