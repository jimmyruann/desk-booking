# How to deploy

```
### ASSUMING YOU HAD AWS CREDENTIALS SETUP ###

# Deploy the EKS cluster
eksctl create cluster -f eks-cluster.yaml

# Update the local kube.config with the one you have just created
aws eks --region ap-southeast-2 update-kubeconfig --name desk-booking-prod

# Install Istio
# https://istio.io/latest/docs/setup/install/istioctl/
istioctl install -y

# Install cert-manager
# https://cert-manager.io/docs/installation/
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.0/cert-manager.yaml

# Finally source this
source ./deploy.sh

```
