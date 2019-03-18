import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css'
import ls from "local-storage"
import Help from './Help'
import { schema, uiSchema } from './SchemaDefinitions'


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
        <Help></Help>
        <Form schema={schema}
          uiSchema={uiSchema}
          formData={this.state.pipelineFormData}
          onChange={this.updateFormData}
          onSubmit={this.submitFormData}
          onError={log("errors")}
        />
      </div>
    )
  }
}

export default Home

