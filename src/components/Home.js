import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css'
import ls from "local-storage"
import Help from './Help'
import { schema, uiSchema } from './SchemaDefinitions'
import PipelineGraphCollection from './PipelineGraphCollection'
import test_pipeline from './test_pipeline'
import { Menu } from 'semantic-ui-react'
import { validate_parents_exist, validate_predecessor_tasks, validate_all } from './Validate'
import diff from 'deep-diff'
import { cloneDeep } from 'lodash'
import {convertToPipelineFormat} from './utils'

const log = (type) => {
  console.log("error")
}

export class Home extends Component {
  state = {
    pipelineFormData: ls.get("pipelineFormData"),
    valid: false
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
    try {
      let steps = convertToPipelineFormat(form.formData).steps
      this.setState({
        valid: (validate_parents_exist(steps) && validate_predecessor_tasks(steps))
      })
    } catch {
      this.setState({
        valid: false
      })
    }
    
    //validate_all()
    this.setState({
      pipelineFormData: form.formData
    });
    //ls.set("pipelineFormData", form.formData)
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

