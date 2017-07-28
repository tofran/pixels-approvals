#!/usr/bin/python
from pixelscamp_api import PixelsAPI
from secrets import *
import json

def get_approved():
    api = PixelsAPI(api_key = api_key)
    return api.badges_owners(92)['owners']['2017']

def gen_timeline(data):
    timeline = dict()
    for each in data:
        day = each['created'][:10].replace('-', '')
        if day not in timeline:
            timeline[day] = list()
        timeline[day].append(each['user'])
    return timeline

def to_file(data, filename, sort=False):
    with open(filename, 'w') as f:
        json.dump(data, f, sort_keys=sort)

def from_file(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return data
