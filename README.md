# Pipeline creator

## Install:
1.)
```
git clone https://github.com/shubham-padia/pipeline_creator
cd asr_airflow
```
2.) run `bash install.sh`

3.) To deploy i.e run your project, execute `bash deploy.sh`

## Changing the IP:
By default the installation script will pickup your network IP (which you can find by ifconfig) and use that.
If you want to change that IP to either 127.0.0.1 or some other IP please follow the below given instructions.

1.) Change the `REACT_APP_SERVER URL` with your desired IP in .env
2.) Run `bash deploy.sh`

Please note that you also have to change the IP for the backend, please have a look at the README of the [backend repo](https://github.com/shubham-padia/asr_airflow) for the same.

## Manual installation instructions:

1.) Install the serve package globally
    ```
    npm install -g serve
    ```

2.) Copy the example service file for editing (NOTE: Make sure you name the copied file as pipeline-creator.service as that file name is out of source control and you do not have to worry about the changes made to that file showing up in git).
    ```
    cp server-example.service pipeline-creator.service
    ```

3.) Edit the `ExecStart` field in pipeline-creator.service to point to the location fo the node binary in your system. Change `User` and `WorkingDirectory` to reflect relevant information on your system.
Then copy the service file to `/etc/lib/systemd` (or wherever you prefer to keep your service files).

    ```
    sudo -s
    cp pipeline-creator.service /etc/lib/systemd/pipeline-creator.service
    systemctl daemon-reload
    systemctl enable pipeline-creator
    ```

4.) Make your production build
    ```
    npm run build
    ```

5.) Run the service
    ```
    systemctl start pipeline-creator
    ```
