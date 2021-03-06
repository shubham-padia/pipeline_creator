import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { Menu, Button, Form } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import { StatusModal } from './StatusModal';
import { UploadSpinner } from './UploadSpinner';

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            isModalOpen: false,
            responseOk: false,
            loading: false
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: SERVER_URL + '/no-url'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');

        this.addedfile = file => {
            let fileList = cloneDeep(this.state.fileList)
            fileList.push(file);
            this.setState({
                fileList
            });
        }

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;
    }

    handleSubmit = (event) => {
        // Prevent default behavior
        event.preventDefault();

        var data = new FormData(event.target);

        for (let f of this.state.fileList) {
            data.append('file', f);
        }

        this.setState({
            loading: true
        }, () => {
                fetch(process.env.REACT_APP_SERVER_URL + '/api/v1/upload-audio', {
                method: 'POST',
                body: data,
                header: {
                    'Access-Control-Allow-Origin': '*',
                }
            }).then(response => {
                console.log("we are not in the catch block")
                console.log("response.ok value is:")
                console.log(response.ok)
                this.setState({
                    responseOk: response.ok,
                    isModalOpen: true,
                    loading: false
                });
            }).catch((err) => {
                console.log("We are in the catch block")
                console.log(err)
                this.setState({
                    responseOk: false,
                    isModalOpen: true,
                    loading: false
                });
            });
    })

}

onModalClose = () => {
    this.setState({ isModalOpen: false, responseOk: false });
}

render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
        init: dz => this.dropzone = dz,
        drop: this.callbackArray,
        addedfile: this.addedfile,
        removedfile: this.removedfile
    }

    return (
        <div>
            <Menu className="top fixed" stackable size="huge">
                <Menu.Item><a href='/'>Pipeline Form</a></Menu.Item>
                <Menu.Item><a href='/upload'>Upload Audio</a></Menu.Item>
            </Menu>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: "50px", marginBottom: "50px" }}>
                <Form.Field>
                    <label>Recording ID</label>
                    <input required name="recording_id" />
                </Form.Field>
                <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                <StatusModal isModalOpen={this.state.isModalOpen} responseOk={this.state.responseOk} onClose={this.onModalClose} />
                <Button type='submit' style={{ marginTop: '10px', background: '#0bdecb', color: 'white' }}>Submit</Button>
            </Form>
            <UploadSpinner loading={this.state.loading} ></UploadSpinner>
        </div>
    )
}
}

export default Upload