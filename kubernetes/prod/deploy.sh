sudo apt update
sudo apt install jq -y

app_secret=$(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:ap-southeast-2:917226228317:secret:desk-booking-secret-hWjKkD --query SecretString --output text)
rds_secret=$(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:ap-southeast-2:917226228317:secret:desk-booking-app-db-secret-gSD1IS --query SecretString --output text)

if [[ -n "${app_secret}" && -n "${rds_secret}" ]]; then

    for s in $(echo $app_secret | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]"); do
        export $s
    done

    echo "Environment variables was set."

    DATABASE_USER=$(echo $rds_secret | jq -r '.username')
    DATABASE_PASSWORD=$(echo $rds_secret | jq -r '.password')
    DATABASE_HOST=$(echo $rds_secret | jq -r '.host')
    DATABASE_PORT=$(echo $rds_secret | jq -r '.port')
    DATABASE_DBNAME=$(echo $rds_secret | jq -r '.dbname')

    DATABASE_URL="postgres://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_DBNAME?schema=public"

    export DATABASE_URL=$DATABASE_URL

    echo "RDS DB Environment variables was set."

    envsubst <./app-deploy.yaml | kubectl apply -f -

    kubectl apply -f ./cert-issuer.yaml

    kubectl apply -f ./cert-certificate.yaml

    kubectl apply -f ./istio-gateway.yaml

else
    echo "Check your AWS secrets"
fi
