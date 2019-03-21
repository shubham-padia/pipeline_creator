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

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

const log = (type) => {
  console.log("error")
}

export class Home extends Component {
  state = {
    pipelineFormData: ls.get("pipelineFormData"),
    status: <span color="red">Invalid form</span>
  }

  convertToPipelineFormat = (formDataOriginal) => {
    //make sure we don't make any changes to the object which has been passed as a reference.
    var formData = cloneDeep(formDataOriginal);

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

  submitFormData = (form) => {
    this.setState({
      pipelineFormData: cloneDeep(form.formData)
    });
    this.saveStateToLocalStorage();

    var formData = form.formData;
    var file_name = formData.name;
    delete formData.name;

    var resultFormData = JSON.stringify(this.convertToPipelineFormat(form.formData), null, 2);
    var fileDownload = require('js-file-download');
    fileDownload(resultFormData, file_name + '.json');
  }

  updateFormData = (form) => {
    /*let steps = convertToPipelineFormat(form.formData).steps
    if (validate_parents_exist(steps)) {
      this.setState({
        status: <span color="green">Valid Form</span>
      });
    } else if (validate_predecessor_tasks(steps)) {
      this.setState({
        status: <span color="red">Invalid Form</span>
      });
    }*/
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
    let steps = this.convertToPipelineFormat(formData).steps;

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
            <Menu.Item><span color="red">{this.state.status}</span></Menu.Item>
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
            validate={this.validate}
          />
        </div>
      </div>
    )
  }
}

export default Home

