import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css'
import ls from "local-storage"
import Help from './Help'
import { schema, uiSchema } from './SchemaDefinitions'
import PipelineGraphCollection from './PipelineGraphCollection'
import { Menu } from 'semantic-ui-react'
import { validate_parents_exist, validate_predecessor_tasks } from './Validate'
import { cloneDeep } from 'lodash'
import {convertToPipelineFormat} from './utils'

export class Home extends Component {
  constructor(props) {
    super(props);
    
    let pipelineFormData = ls.get("pipelineFormData");
    let valid = false;
    try {
      let steps = convertToPipelineFormat(pipelineFormData).steps
      valid = (validate_parents_exist(steps) && validate_predecessor_tasks(steps));
    } catch {
    }

    this.state = {
      pipelineFormData,
      valid
    };
  }

  

  submitFormData = (form) => {
    this.setState({
      pipelineFormData: cloneDeep(form.formData)
    });
    this.saveStateToLocalStorage();

    var formData = form.formData;
    var file_name = formData.name;
    delete formData.name;

    var resultFormData = JSON.stringify(convertToPipelineFormat(form.formData), null, 2);
    var fileDownload = require('js-file-download');
    fileDownload(resultFormData, file_name + '.json');
  }

  updateFormData = (form) => {
    let valid = false;
    try {
      let steps = convertToPipelineFormat(form.formData).steps;
      valid = (validate_parents_exist(steps) && validate_predecessor_tasks(steps))
    } catch {
    }
    
    // This needs to an atomic operation. Do not set the state for each of the value seperately.
    this.setState({
      pipelineFormData: form.formData,
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

    if (!validate_parents_exist(steps)) {
      errors.steps.addError("Parents do not exist. You're an orphan now. Deal with it.")
    } else if (!validate_predecessor_tasks(steps)) {
      errors.steps.addError("Invalid predecessors")
    }

    return errors;
  }

  render() {
    return (
      <div>
        <Menu className="top fixed" stackable size="huge">
          <Menu.Item>Pipeline Generator</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              {this.state.valid ? <span style={{color: "green"}}>Valid Form</span> : <span style={{color: "red"}}>Invalid Form</span>}
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
            validate={this.validate}
          />
        </div>
      </div>
    )
  }
}

export default Home

