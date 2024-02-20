from django.shortcuts import render
from django.http import HttpResponse
import requests
from yandex_music import Client
from django.db import connection
from django.shortcuts import redirect 
import os


token = ""
f = open("apps/tk.txt", "r")
token = f.read()

client = Client(token).init()

username = ""
isLogin = False

cursor = connection.cursor()


def integration(req):
    return render(req, "integration.html")


def templink(req):
    link = str(req.POST.get("link", "none")).split("/")
    playlist_id = link[-1]
    username_owner = link[-3]

    response = requests.get(f'https://api.music.yandex.net/users/{username_owner}')
    uid = int(response.json()["result"]["uid"])

    respons_mas = []

    playlist_usr = client.users_playlists(playlist_id, user_id=uid).fetch_tracks()
    for i in range(len(playlist_usr)):
        name = str(playlist_usr[i]["track"]["title"]).replace("'", " ").lower()
        artName = []
        for j in range(len(playlist_usr[i]["track"]["artists"])):            #кол-во артистов 
            artName.append(str(playlist_usr[i]["track"]["artists"][j]["name"]).replace("'", " ").lower())

        respons_mas.append(f'{", ".join(artName)},{name}')

        for a_name in artName:
            cursor.execute(f"SELECT * FROM Artist WHERE name = '{a_name}'")
            otv = cursor.fetchall()
            if len(otv) >= 1:
                musc = []
                for song_mus in otv:
                    musc.append(song_mus[1])
                if name not in musc:
                    musc.append(name)
                    print(','.join(musc))
                    cursor.execute(f"UPDATE Artist SET music = '{','.join(musc)}' WHERE name = '{a_name}'")
            else:
                os.mkdir(f"music/{a_name}")
                cursor.execute(f"INSERT INTO Artist (name, music) VALUES ('{a_name}', '{name}')")
            playlist_usr[i].fetch_track().download(f"music/{a_name}/{name}.mp3")
    
    stroc_resp = ";".join(respons_mas)
    name_lst = "perenos" + str(playlist_id)+str(uid)

    reqvs = f"INSERT INTO user_{username} (listName, musics) VALUES ('{name_lst}', '{stroc_resp}')"
    cursor.execute(reqvs)

    return redirect('home', permanent=True)


def testlog(req):
    global isLogin
    global username

    name = str(req.POST.get("name", "none"))
    passwd = str(req.POST.get("passwd", "none"))
    mail = str(req.POST.get("mail", "none"))


    if mail == "none":  #вход
        cursor.execute(f"SELECT id FROM user WHERE name = '{name}' AND passwd = '{passwd}'")
        resp = cursor.fetchall()
        if len(resp) == 1:
            username = name
            isLogin = True

            return redirect('home', permanent=True)
        else:
            return HttpResponse("не правильный логин или пароль")
    else:                #рега
        cursor.execute(f"SELECT id FROM user WHERE name = '{name}'")
        resp = cursor.fetchall()
        if len(resp) >= 1:
            return HttpResponse("аккаунт с таким именем есть")
        else:
            cursor.execute(f"CREATE TABLE 'user_{name}' (listName TEXT, musics TEXT)")
            cursor.execute(f"INSERT INTO user (name, passwd, mail) VALUES ('{name}', '{passwd}', '{mail}')")
            username = name
            isLogin = True
            
            return redirect('home', permanent=True)
    

def index(req):
    if isLogin == False:
        return render(req, "login.html")
    else:
        cursor.execute(f"SELECT * FROM user_{username}")
        resp = cursor.fetchall()

        dict = {}

        for corteg in resp:
            songs = []

            for song in str(corteg[1]).split(";"):
                if song != "":
                    songg = song.split(",")
                    artist = songg[0]
                    name_song = songg[1]

                    songs.append(f"{artist.capitalize()} - {name_song.capitalize()}")

            dict[corteg[0]] = songs


        context = {
            "user_name": f"<h1>{username}</h1>",
            "dict": dict
        }

        return render(req, "index.html", context = context)
    

def artist(req, artist):
    arts = str(artist).lower()
    cursor.execute(f"SELECT * FROM Artist WHERE name = '{arts}'")
    otv = str(cursor.fetchall()[0][1])
    music = []

    for song in otv.split(","):
        music.append(f"{arts.capitalize()} - {song.capitalize()}")


    context = {
        "name" : f"<h1>{arts.capitalize()}</h1>",
        "tracks" : music
    }

    return render(req, "artist.html", context = context)