import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import 'bootstrap/dist/css/bootstrap.css'
import ls from "local-storage"
import Help from './Help'
import { schema, uiSchema, input_formats } from './SchemaDefinitions'
import PipelineGraphCollection from './PipelineGraphCollection'
import { Menu, Input } from 'semantic-ui-react'
import { validate_all, validate_all_boolean } from './Validate'
import { cloneDeep } from 'lodash'
import { convertToPipelineFormat, importFromPipelineFormat } from './utils'
import { diff, applyChange } from 'deep-diff'
import { StatusModal } from './StatusModal'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export class Home extends Component {
  constructor(props) {
    super(props);

    let pipelineFormData = ls.get("pipelineFormData");
    let valid = false;
    try {
      let steps = convertToPipelineFormat(pipelineFormData).steps
      valid = validate_all_boolean(steps, pipelineFormData);
    } catch {
    }

    this.state = {
      pipelineFormData,
      valid,
      isModalOpen: false,
      responseOk: false
    };
  }

  handleFileChosen = (file) => {
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      let content = fileReader.result;
      let pipelineFormData = {};
      try {
        content = JSON.parse(content)
        pipelineFormData = importFromPipelineFormat(content);
        pipelineFormData.name = file.name.replace(/\.[^/.]+$/, "")
        this.setState({
          pipelineFormData: pipelineFormData
        });
        this.saveStateToLocalStorage();
      } catch (err) {
        alert("The file being imported is invalid");
      }
    };
    fileReader.readAsText(file);
  };

  handleMetadataImport = (file) => {
    let fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      let content = fileReader.result;

      try {
        JSON.parse(content) // check if content is valid JSON
        let pipelineFormData = this.state.pipelineFormData
        pipelineFormData.metadata = content
        this.setState({
          pipelineFormData: pipelineFormData
        });
        this.saveStateToLocalStorage();
      } catch (err) {
        alert("The file being imported is invalid");
      }
    };
    fileReader.readAsText(file);
  };

  exportFormData = () => {
    var formData = cloneDeep(this.state.pipelineFormData);
    var file_name = formData.recording_id + '_' + formData.pipeline_id;
    delete formData.name;

    var resultFormData = JSON.stringify(convertToPipelineFormat(formData), null, 2);
    var fileDownload = require('js-file-download');
    fileDownload(resultFormData, file_name + '.json');
  }

  submitFormData = (form) => {
    this.setState({
      pipelineFormData: cloneDeep(form.formData)
    });
    this.saveStateToLocalStorage();

    var formData = cloneDeep(form.formData);

    const recording_id = formData.recording_id;
    const pipeline_id = formData.pipeline_id;
    const version = formData.version

    delete formData.name;
    delete formData.recording_id;
    delete formData.pipeline_id;
    delete formData.version;

    const data = {
      version: version,
      recording_id: recording_id,
      pipeline_id: pipeline_id,
      pipeline: convertToPipelineFormat(formData)
    }

    const url = SERVER_URL + '/api/v1/metadata-registry';
    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
        .then(response => {
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
    } catch {
      this.setState({
        responseOk: false,
        isModalOpen: true
      })
    }
  }

  onModalClose = () => {
    this.setState({ isModalOpen: false, responseOk: false });
  }

  updateFormData = (form) => {
    let formData = cloneDeep(form.formData);
    let formDiff = diff(this.state.pipelineFormData, formData);

    if (formDiff) {
      if (formDiff.length === 1) {
        for (var diffObj of formDiff) {
          let path = diffObj.path;

          if (path && diffObj.kind === "E" && path[path.length - 1] === "task_type") {
            let change = cloneDeep(diffObj);

            change.path[path.length - 1] = "inputs";
            change.rhs = JSON.stringify(input_formats[diffObj.rhs], null, 2)
            applyChange(formData, true, change);
          }
        }
      }
    }

    let valid = false;
    try {
      let steps = convertToPipelineFormat(formData).steps;
      valid = validate_all_boolean(steps, formData)
    } catch {
    }

    // This needs to an atomic operation. Do not set the state for each of the value seperately.
    this.setState({
      pipelineFormData: formData,
      valid
    });
  }

  saveStateToLocalStorage = () => {
    ls.set("pipelineFormData", this.state.pipelineFormData)
  }

  componentDidMount() {
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    this.saveStateToLocalStorage();
  }

  validate = (formData, errors) => {
    let steps = convertToPipelineFormat(formData).steps;

    let error_array = validate_all(steps, formData);
    for (var error of error_array) {
      errors.steps.addError(error);
    }

    return errors;
  }

  render() {
    return (
      <div>
        <Menu className="top fixed" stackable size="huge">
          <Menu.Item><a href='/'>Pipeline Form</a></Menu.Item>
          <Menu.Item><a href='/upload'>Upload Audio</a></Menu.Item>
          <Menu.Item>
            Import metadata
              <Input type='file'
              id='metadata'
              accept='.json'
              onChange={e => this.handleMetadataImport(e.target.files[0])}
            />
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item>
              Import pipeline
              <Input type='file'
                id='file'
                accept='.json'
                onChange={e => this.handleFileChosen(e.target.files[0])}
              />
            </Menu.Item>

            <Menu.Item>
              {this.state.valid ? <span style={{ color: "green" }}>Valid Form</span> : <span style={{ color: "red" }}>Invalid Form</span>}
            </Menu.Item>

            <Menu.Item name='pipeline-graphs'>
              <PipelineGraphCollection valid={this.state.valid} steps={this.state.pipelineFormData}></PipelineGraphCollection>
            </Menu.Item>

            <Menu.Item name='help'>
              <Help></Help>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div style={{ marginTop: "50px", marginBottom: "50px" }} >
          <Form schema={schema}
            uiSchema={uiSchema}
            formData={this.state.pipelineFormData}
            onChange={this.updateFormData}
            onSubmit={this.submitFormData}
            validate={this.validate}>
          </Form>
          <button onClick={this.exportFormData} style={{ marginTop: "10px" }} className='btn btn-success'> Export </button>
          <StatusModal isModalOpen={this.state.isModalOpen} responseOk={this.state.responseOk} onClose={this.onModalClose} />
        </div>
      </div>
    )
  }
}

export default Home

