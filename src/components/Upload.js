import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { Menu, Button, Form } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import { StatusModal } from './StatusModal'

export class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            isModalOpen: false,
            responseOk: false
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'no-url'
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

        fetch(process.env.REACT_APP_SERVER_URL + '/api/v1/upload-audio', {
            method: 'POST',
            body: data
        }).then(response => {
            this.setState({
                responseOk: response.ok,
                isModalOpen: true
            });
        })
            .catch(() => {
                this.setState({
                    responseOk: false,
                    isModalOpen: true
                });
            });
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
                    <Button type='submit' style={{marginTop: '10px', background: '#0bdecb', color: 'white'}}>Submit</Button>
                </Form>
            </div>
        )
    }
}

export default Upload