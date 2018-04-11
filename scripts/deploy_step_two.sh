#! /bin/bash

# when file doesn't work: sed -i 's/\r$//' [filename]

### SERVER DEPLOY AUTOMATION PART 2 ###

# STEP 1: download uwsgi and nginx and rabbitmq-server
sudo apt-get install build-essential nginx
sudo -H pip3 install uwsgi

# STEP 2: set up python environment for Django app (should be in virtualenv)
pip install -r /home/arajung/arajung.com/requirements.txt

# STEP 3: copy and paste configuration files for uwsgi and nginx
sudo mkdir -p /etc/uwsgi/sites
sudo cp /home/arajung/arajung.com/config/uwsgi/arajung.ini /etc/uwsgi/sites/arajung.ini
sudo cp /home/arajung/arajung.com/config/uwsgi/uwsgi.service /etc/systemd/system/uwsgi.service

sudo cp /home/arajung/arajung.com/config/nginx/arajung.conf /etc/nginx/sites-available/arajung.conf
sudo ln -s /etc/nginx/sites-available/arajung.conf /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl start uwsgi

# STEP 4: changing firewall options
sudo ufw allow 'Nginx Full'

# STEP 5: last step configuring uwsgi and nginx
sudo systemctl enable nginx
sudo systemctl enable uwsgi

# STEP 4: configuring supervisor and firing up celery/celerybeat workers
sudo apt-get install supervisor rabbitmq-server
sudo service supervisor start

sudo cp /home/arajung/arajung.com/config/supervisor/celery.conf /etc/supervisor/conf.d/celery.conf
sudo cp /home/arajung/arajung.com/config/supervisor/celerybeat.conf /etc/supervisor/conf.d/celerybeat.conf

sudo mkdir -p /var/log/celery
sudo touch /var/log/celery/arajung_worker.log
sudo touch /var/log/celery/arajung_beat.log

sudo supervisorctl reread
sudo supervisorctl update
