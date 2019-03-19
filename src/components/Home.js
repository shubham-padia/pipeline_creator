import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css'
import ls from "local-storage"
import Help from './Help'
import { schema, uiSchema } from './SchemaDefinitions'
import PipelineGraphCollection from './PipelineGraphCollection'
import { diffJson } from 'diff'
import test_pipeline from './test_pipeline'
import { Menu } from 'semantic-ui-react'


function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

const log = (type) => console.log.bind(console, type);

const convertToPipelineFormat = (formData) => {
  var formatted_steps = {};
  if (isEmpty(formData)) {
    return formData;
  }
  formData.metadata = JSON.parse(formData.metadata)
  for (var steps_session_info of formData.steps) {
    var formatted_steps_for_session = {};
    var session_num = steps_session_info.session_num;

    for (var step_for_session of steps_session_info.steps_for_session) {
      let step_id = step_for_session.id;
      delete step_for_session.id;
      step_for_session.inputs = JSON.parse(step_for_session.inputs);
      if (step_for_session.parent_id !== undefined) {
        step_for_session.parent_id = step_for_session.parent_id.split(",").map(function (item) {
          return parseInt(item.trim());
        });
      }
      formatted_steps_for_session[step_id] = step_for_session;
    }
    formatted_steps[session_num] = formatted_steps_for_session;
  }
  formData.steps = formatted_steps;
  return formData;
}

export class Home extends Component {
  state = {
    pipelineFormData: ls.get("pipelineFormData")
  }

  submitFormData = (form) => {
    var formData = form.formData;
    var file_name = formData.name;
    delete formData.name;

    var resultFormData = JSON.stringify(convertToPipelineFormat(form.formData), null, 2);
    var fileDownload = require('js-file-download');
    fileDownload(resultFormData, file_name + '.json');
  }

  updateFormData = (form) => {
    console.log(form.formData)
    console.log(diffJson(this.state.pipelineFormData, form.formData))
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

  render() {
    return (
      <div>

        <Menu className="top fixed" stackable size="huge">
          <Menu.Item>Pipeline Generator</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name='pipeline-graphs'>
              <PipelineGraphCollection steps={test_pipeline}></PipelineGraphCollection>
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
            onError={log("errors")}
          />
        </div>
      </div>
    )
  }
}

export default Home

