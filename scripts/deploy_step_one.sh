#! /bin/bash

# when file doesn't work: sed -i 's/\r$//' [filename]

### SERVER DEPLOY AUTOMATION ###

# STEP 1: change root user password
echo -e "makeitpopwear!1\nmakeitpopwear!1" | passwd root

# STEP 2: create new user and set password
echo -e "arajunggogo!\narajunggogo!" | adduser arajung
usermod -aG sudo arajung
groups arajung

git clone https://github.com/ppark9553/arajung.git
mv ./arajung /home/arajung/arajung.com

# STEP 3: deploy firewall and allow ports 8000 and OpenSSH
sudo ufw app list
sudo ufw allow OpenSSH
su -c "y" | sudo ufw enable
sudo ufw status
sudo ufw allow 8000

# STEP 4: download PostgreSQL and tweak settings
sudo apt-get update # update OS
sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib

# DB settings
su -c "psql -c \"CREATE DATABASE arajung;\"" postgres
su -c "psql -c \"CREATE USER arajung WITH PASSWORD 'makeitpopweAR!1';\"" postgres
su -c "psql -c \"ALTER ROLE arajung SET client_encoding TO 'utf8';\"" postgres
su -c "psql -c \"ALTER ROLE arajung SET default_transaction_isolation TO 'read committed';\"" postgres
su -c "psql -c \"ALTER ROLE arajung SET timezone TO 'UTC';\"" postgres
su -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE arajung TO arajung;\"" postgres

# PostgreSQL localhost setting
cd /etc/postgresql/9.5/main
vim +":%s/#listen_addresses = 'localhost'/listen_addresses = '*'/g | wq" postgresql.conf

cd /etc/postgresql/9.5/main
vim +"%s/127.0.0.1\/32/0.0.0.0\/0   /g | %s/::1\/128/::\/0/g | wq" pg_hba.conf

echo starting PostgreSQL
sudo systemctl start postgresql.service
echo enabling PostgreSQL
sudo systemctl enable postgresql.service
echo restarting PostgreSQL
sudo systemctl restart postgresql.service
# /etc/init.d/postgresql restart
echo done!

# STEP 5: creating python virtual environment for project specific management
export LC_ALL=C
sudo -H pip3 install --upgrade pip
sudo pip3 install setuptools
sudo -H pip3 install virtualenv virtualenvwrapper

echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" >> ~/.bashrc
echo "export WORKON_HOME=/home/arajung/venv" >> ~/.bashrc
echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

reboot
