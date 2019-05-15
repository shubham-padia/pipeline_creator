# Pipeline creator

## Install:
1.)
```
git clone https://github.com/shubham-padia/pipeline_creator
cd asr_airflow
```
2.) run `bash install.sh`

3.) To deploy i.e run your project, execute `bash deploy.sh`

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
