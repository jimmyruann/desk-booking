envsubst <db-migration.yaml | kubectl apply -f -
envsubst <app-deploy.yaml | kubectl apply -f -
