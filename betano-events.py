import urllib.request
from html.parser import HTMLParser
import json
import boto3
from botocore.config import Config


def lambda_handler(event, context):

    my_config_dynamo= Config(
        region_name = 'sa-east-1',
    )

    client = boto3.resource('dynamodb',config=my_config_dynamo)
    table = client.Table("events_betano")

    class MyHTMLParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.reset()
            self.initialJson = ''

        def handle_data(self, data):
            if 'window["initial_state"]=' in data:
                self.initialJson = json.loads(data.replace('window["initial_state"]=', ''))

    contents = urllib.request.urlopen("https://br.betano.com/virtuals/futebol/copa").read().decode()
    parser = MyHTMLParser()
    parser.feed(contents)

    print(parser.initialJson['data'])

    events = parser.initialJson['data']['content']


    for event in events:
        print(event)
        print('https://br.betano.com/api'+event['url'])
        contents = urllib.request.urlopen('https://br.betano.com/api'+event['url']).read().decode()
        jsonContent = json.loads(contents)
        print(jsonContent)
        for market in jsonContent['data']['currentEvents'][0]['markets']:
            if('handicap' in market):
                market['handicap'] = str(market['handicap'])
            for selection in market['selections']:
                if('price' in selection):
                    selection['price'] = str(selection['price'])
                if('handicap' in selection):
                    selection['handicap'] = str(selection['handicap'])

        table.put_item(Item=jsonContent['data']['currentEvents'][0])


    contents = urllib.request.urlopen("https://br.betano.com/virtuals/futebol/premier/").read().decode()
    parser = MyHTMLParser()
    parser.feed(contents)

    events = parser.initialJson['data']['content']

    for event in events:
        print(event)
        contents = urllib.request.urlopen('https://br.betano.com/api'+event['url']).read().decode()
        jsonContent = json.loads(contents)
        for market in jsonContent['data']['currentEvents'][0]['markets']:
            if('handicap' in market):
                market['handicap'] = str(market['handicap'])
            for selection in market['selections']:
                if('price' in selection):
                    selection['price'] = str(selection['price'])
                if('handicap' in selection):
                    selection['handicap'] = str(selection['handicap'])

        table.put_item(Item=jsonContent['data']['currentEvents'][0])

    contents = urllib.request.urlopen("https://br.betano.com/virtuals/futebol/champions/").read().decode()
    parser = MyHTMLParser()
    parser.feed(contents)

    events = parser.initialJson['data']['content']

    for event in events:
        print(event)
        contents = urllib.request.urlopen('https://br.betano.com/api'+event['url']).read().decode()
        jsonContent = json.loads(contents)
        for market in jsonContent['data']['currentEvents'][0]['markets']:
            if('handicap' in market):
                market['handicap'] = str(market['handicap'])
            for selection in market['selections']:
                if('price' in selection):
                    selection['price'] = str(selection['price'])
                if('handicap' in selection):
                    selection['handicap'] = str(selection['handicap'])

        table.put_item(Item=jsonContent['data']['currentEvents'][0])
