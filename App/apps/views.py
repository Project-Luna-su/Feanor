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

client = Client(token.replace("\n", "")).init()

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
        name = str(playlist_usr[i]["track"]["title"]).replace("'", " ").replace("_", " ").lower()
        artName = []
        avatar_mas = []
        for j in range(len(playlist_usr[i]["track"]["artists"])):            #кол-во артистов 
            avatar = str(playlist_usr[i]["track"]["artists"][j]["cover"]["uri"]).replace("%%", "400x400")
            artName.append(str(playlist_usr[i]["track"]["artists"][j]["name"]).replace("'", " ").replace("_", " ").lower())
            avatar_mas.append(avatar)

        respons_mas.append(f'{"_".join(artName)},{name}')

        for idx_name in range(len(artName)):
            cursor.execute(f"SELECT * FROM Artist WHERE name = '{artName[idx_name]}'")
            otv = cursor.fetchall()
            if len(otv) >= 1:
                musc = []
                for song_mus in otv:
                    musc.append(song_mus[1])
                if name not in musc:
                    musc.append(name)
                    cursor.execute(f"UPDATE Artist SET music = '{','.join(musc)}' WHERE name = '{artName[idx_name]}'")
            else:
                os.mkdir(f"apps/static/music/{artName[idx_name]}")
                cursor.execute(f"INSERT INTO Artist (name, music, avatar) VALUES ('{artName[idx_name]}', '{name}', 'https://{avatar_mas[idx_name]}')")
            playlist_usr[i].fetch_track().download(f"apps/static/music/{artName[idx_name]}/{name}.mp3")
    
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
            cursor.execute(f"INSERT INTO user_{name} (listName, musics) VALUES ('likes_{name}', '')")
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
                    artist = songg[0].split("_")
                    artist = ", ".join(artist)
                    name_song = songg[1]

                    songs.append(f"{artist.capitalize()} - {name_song.capitalize()}")

            dict[corteg[0]] = songs


        context = {
            "user_name": f"{username}",
            "dict": dict
        }

        return render(req, "main.html", context = context)
    

def artist(req, artist):
    arts = str(artist).lower()
    cursor.execute(f"SELECT * FROM Artist WHERE name = '{arts}'")
    res = cursor.fetchall()
    otv = str(res[0][1])
    music = []

    for song in otv.split(","):
        music.append(f"{arts.capitalize()} - {song.capitalize()}")


    context = {
        "atrtist__name" : arts.capitalize(),
        "tracks" : music,
        "avatar_artist" : str(res[0][2])
    }

    return render(req, "artist.html", context=context)

def profile(req):
    if isLogin == False:
        return render(req, "login.html")
    else:
        cursor.execute(f"SELECT * FROM user_{username}")
        resp = cursor.fetchall()

        dict = {}

        for corteg in resp:
            songs = {}

            for song in str(corteg[1]).split(";"):
                if song != "":
                    songg = song.split(",")
                    artist = songg[0].split("_")
                    artist = ", ".join(artist)
                    name_song = songg[1]

                    songs.update({ artist.capitalize() : name_song.capitalize()})

            dict[corteg[0]] = songs


        context = {
            "user_name": f"{username}",
            "dict": dict
        }

        return render(req, "profile.html", context = context)

def test(req):
    cursor.execute(f"SELECT listName FROM user_{'admin'}")
    print(cursor.fetchall())
    return HttpResponse("her")

def main(req):
   context = {
            "user_name": f"<h1>{username}</h1>",
            "dict": dict
        }
   return render(req, "main.html", context=context)


def avtar(artist):
    cursor.execute(f"SELECT * FROM Artist WHERE name = '{artist}'")
    otv = str(cursor.fetchall()[0][2])
    return otv


def playlist(req, name):
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    resp = cursor.fetchall()
    resp_mas = []
    for i in resp:
        if "user_" in i[0]:
            resp_mas.append(i[0])

    nms_owner =  []

    for i in resp_mas:
        cursor.execute(f"SELECT * FROM {i}")
        resp1 = cursor.fetchall()
        for j in resp1:
            if name in j[0]:
                nms_owner.append((name, i))
                break

    cursor.execute(f"SELECT * FROM {nms_owner[0][1]} WHERE listName = '{nms_owner[0][0]}'")
    resp = cursor.fetchall()

    dict = {}
    artname = ''
    for corteg in resp:
        songs = {}
        for song in str(corteg[1]).split(";"):
            songg = song.split(",")
            artname = songg[0]
            name_song = songg[1]
            if "_" not in artname:
                songs[name_song.capitalize()] = avtar(artname.lower())
            else:
                artnam = songg[0].split("_")
                artname = ", ".join(artnam) 
                songs[name_song.capitalize()] = avtar(artnam[0].lower())

        dict[artname] = songs
    
    context = {
        "pls_name" : name,
        "dict" : dict
    }
    return render(req, "playlist.html", context=context)