docker cp ./app/db/seed_wells.sql postgres_db:/seed_wells.sql
docker-compose exec db psql -U postgres -d wells_db -f /seed_wells.sql

docker cp ./app/db/seed_timescale.sql timescale_db:/
docker-compose exec timescaledb psql -U timescale -d timescale_db -f /seed_timescale.sql