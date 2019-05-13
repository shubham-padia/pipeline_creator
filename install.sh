sudo apt install wget
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
source ~/.profile
nvm install 11.10.1
npm install -g serve
npm install
cp serve-example.service pipeline-creator.service
sed -i -e "s/shubham/$USER/g" pipeline-creator.service
cp pipeline-creator.service /lib/systemd/system/pipeline-creator.service
sudo systemctl daemon-reload
sudo systemctl enable pipeline-creator
