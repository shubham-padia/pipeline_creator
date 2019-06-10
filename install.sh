sudo apt install wget
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion.sh" ] && \. "$NVM_DIR/bash_completion"
source ~/.profile
source ~/.bashrc
source ~/.bash_profile
nvm install 11.10.1
npm install -g serve
npm install

cp env-example .env
IP_ARRAY=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
IP=$(echo $IP_ARRAY | awk -F\  '{print $NF}')
sed -i -e "s/server_domain_or_IP/$IP/g" .env

cp serve-example.service pipeline-creator.service
sed -i -e "s/shubham/$USER/g" pipeline-creator.service
sed -i -e "s@CURRENT_DIR@$(pwd)@g" pipeline-creator.service
sudo cp pipeline-creator.service /lib/systemd/system/pipeline-creator.service
sudo systemctl daemon-reload
sudo systemctl enable pipeline-creator

sudo ufw allow 4000