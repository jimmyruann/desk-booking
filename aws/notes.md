# AWS Notes

### Architecture

- Route 53
- A Record pointing to ALB
- ALB point to Target group
- Target group points to port 80 ec2 (the application)
- Application/DB secrets are handled by AWS

### Security Group

- Port 80 for application 80
- Port 443 for ALB HTTPS

### HTTPS Certificate

- Request from AWS
- Its free
- Stored on aws certificate manager

### App Secrets

- Stored on AWS Secret manager
- use script in `shell/*.sh` to set environment variables
- make sure you run the shell script with `source`
- or else it won't set the variables

`./setAppEnvVar.sh $(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:xxx-xxx-xxx --query SecretString --output text)`

### Database

- hosted on RDS
- secret stored in Secret manager
- run separate script to set env variable

`./setRDSEnvVariables.sh $(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:ap-southeast-2:917226228317:secret:xxx-xxx-xxx --query SecretString --output text)`
