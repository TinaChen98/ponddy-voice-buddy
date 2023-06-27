export GIT_PROJECT_NAME=${CIRCLE_PROJECT_REPONAME}
cd /projects/$GIT_PROJECT_NAME
git pull -f

# Env
export CNAME=$(cat deploy/CNAME)
export PROJECT_NAME=$(jq -r '.name' < package.json)
# Rmove old docker image tag
docker tag $PROJECT_NAME:latest $PROJECT_NAME:old && docker rmi $PROJECT_NAME:latest || echo "no old image"

# Load docker image
docker load < /images/$PROJECT_NAME.tar
# Copy nginx file
envsubst '${PROJECT_NAME},${CNAME}' < deploy/nginx.template.conf > /composes/enabled_sites/${PROJECT_NAME}.conf
# Copy docker-compose file
envsubst '${PROJECT_NAME}' < deploy/docker-compose.yml > /composes/${PROJECT_NAME}.yml

# Run docker compose
cd /composes
# echo -n "" > files.args
# ls -1 | grep .yml | grep -v \~ | while read f
# do
#     echo -n " -f $f" >> files.args
# done
docker-compose -f voice-buddy-widget.yml down
docker-compose -f voice-buddy-widget.yml up -d
