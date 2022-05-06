sudo docker stop gcalendar
sudo docker rm gcalendar
sudo docker pull tonyvx/gcalendar:1.0
sudo docker run -d --name gcalendar -p 8181:8181 -e TZ=America/New_York tonyvx/gcalendar:1.1