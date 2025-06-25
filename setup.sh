cp .env.example .env

docker exec -i mysql-container mysql -uroot -proot -e "drop database strapi_deg_mdm;create database strapi_deg_mdm;"
docker exec -i mysql-container mysql -uroot -proot -e "create database strapi_deg_mdm;"


git checkout main
git pull 
npm install -f
cd src
git clone https://github.com/beckn/strapi-plugins.git plugins
cd plugins
git checkout feat/meter-data-simulator
git pull
cd plugins/meter-data-simulator
npm install -f
npm run build


cd ../../../../

docker exec -i mysql-container mysql -uroot -proot strapi_deg_mdm < strapi_deg_mdm_dump.sql

npm install -f
npm run develop


# docker exec -i mysql-container mysql -uroot -proot strapi_deg_mdm < strapi_deg_mdm_backup.sql
# cd ~/strapi-deg-mdm/src/plugins/plugins/meter-data-simulator
# git pull
# npm run build


# cd ~

# pm2 restart all