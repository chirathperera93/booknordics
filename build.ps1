<#

.SYNOPSIS
Build and push application configured for the staging environment.

.DESCRIPTION
Build the application with configuration for the staging environment and push
it to the container registry.  Run this script from the project folder.

#>

$repository = "acrcommercetest.azurecr.io/managementapp/staging"
$tag = "latest"

az acr login --name $repository
docker build --tag ${repository}:${tag} --build-arg "REACT_APP_IDENTITY_API_BASE=https://auth.aks-staging.cenium.cloud" --build-arg "REACT_APP_BASE=/admin" --no-cache .
docker push ${repository}:${tag}
