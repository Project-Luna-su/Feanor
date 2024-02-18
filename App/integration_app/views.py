from django.shortcuts import render
import requests
from yandex_music import Client

client = Client("her").init()

def index(req):
    return render(req, "index.html")

def listTrack(req):
    link = str(req.POST.get("link", "none")).split("/")
    playlist_id = link[-1]
    username_owner = link[-3]

    response = requests.get(f'https://api.music.yandex.net/users/{username_owner}')
    uid = int(response.json()["result"]["uid"])

    respons_mas = []

    playlist_usr = client.users_playlists(playlist_id, user_id=uid).fetch_tracks()
    for i in range(len(playlist_usr)):
        name = playlist_usr[i]["track"]["title"]
        artName = []
        for j in range(len(playlist_usr[i]["track"]["artists"])):            #кол-во артистов 
            artName.append(playlist_usr[i]["track"]["artists"][j]["name"])

        respons_mas.append(f'{name} - {", ".join(artName)}')

    return render(req, "tracks.html", context={"response": respons_mas})
