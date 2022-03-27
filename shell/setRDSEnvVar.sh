if [ -z "$1" ]; then
    echo "No argument supplied"

else
    # sudo apt update
    # sudo apt install jq

    DATABASE_USER=$(echo $1 | jq -r '.username')
    DATABASE_PASSWORD=$(echo $1 | jq -r '.password')
    DATABASE_HOST=$(echo $1 | jq -r '.host')
    DATABASE_PORT=$(echo $1 | jq -r '.port')
    DATABASE_DBNAME=$(echo $1 | jq -r '.dbname')

    DATABASE_URL="postgres://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_DBNAME?schema=public"

    export DATABASE_URL=$DATABASE_URL

    echo "RDS DB Environment variables was set."
fi
