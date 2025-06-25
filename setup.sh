cp .env.example .env

docker exec -i mysql-container mysql -uroot -proot -e "drop database strapi_deg_mdm;create database strapi_deg_mdm;"

git checkout main
git pull 
cd src
git clone https://github.com/beckn/strapi-plugins.git plugins
cd plugins
git checkout meter-data-simulator
git pull
cd plugins/meter-data-simulator
npm install
npm run build


cd ../../../../

docker exec -i mysql-container mysql -uroot -proot strapi_deg_mdm < strapi_deg_mdm_backup.sql

npm install
npm run develop


# docker exec -i mysql-container mysql -uroot -proot strapi_deg_mdm < strapi_deg_mdm_backup.sql
# cd ~/strapi-deg-mdm/src/plugins/plugins/meter-data-simulator
# git pull
# npm run build


# cd ~

# pm2 restart all