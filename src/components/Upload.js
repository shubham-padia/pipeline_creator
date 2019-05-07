import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { Button, Form } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';

export class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: []
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

        fetch('http://localhost:8000/api/v1/upload-audio', {
            method: 'POST',
            body: data
        })
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
            <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                    <label>Recording ID</label>
                    <input name="recording_id" />
                </Form.Field>
                <Form.Field>
                    <label>Pipeline ID</label>
                    <input name="pipeline_id" />
                </Form.Field>
                <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                <Button type='submit' >Submit</Button>
            </Form>
        )
    }
}

export default Upload