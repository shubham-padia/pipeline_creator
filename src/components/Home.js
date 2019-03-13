import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css';
import { throws } from 'assert';

const schema = {
  "title": "",
  "type": "object",
  "required": [
    "name",
    "version",
    "metadata",
    "steps"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "version": {
      "type": "string",
      "title": "Version",
      "enum": ["0.0.1"],
      "default": "0.0.1"
    },
    "metadata": {
      "type": "string",
      "title": "Metadata"
    },
    "steps": {
      "type": "array",
      "title": "Steps",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "session_num",
          "steps_for_session"
        ],
        "properties": {
          "session_num": {
            "type": "number",
            "title": "Session Number",
          },
          "steps_for_session": {
            "type": "array",
            "title": "Steps for this session",
            "minItems": 1,
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "number",
                  "title": "Step ID"
                },
                "task_type": {
                  "type": "string",
                  "title": "Task",
                  "enum": ["dummy", "resample", "vad", "diarization", "decoder"],
                  "default": "dummy"
                },
                "parents": {
                  "type": "string",
                  "title": "Parents"
                },
                "inputs": {
                  "type": "string",
                  "title": "Inputs",
                  "default": "{}"
                }
              }
            }
          }
        }
      }
    }
  }
};

const twoWide = {
  classNames: "col-md-4"
}

const uiSchema = {
  "metadata": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 8
    }
  },
  "steps": {
    classNames: "object",
    "ui:options": {
      "orderable": false
    },
    "items": {
      "steps_for_session": {
        "ui:options": {
          "orderable": false
        },
        "items": {
          classNames: "object",
          "id": twoWide,
          "task_type": twoWide,
          "parents": twoWide,
          "inputs": {
            "ui:widget": "textarea",
            "ui:options": {
              "rows": 5
            }
          }
        }
      }
    }
  }
};

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

  for (var steps_session_info of formData.steps) {
    var formatted_steps_for_session = {};
    var session_num = steps_session_info.session_num;

    for (var step_for_session of steps_session_info.steps_for_session) {
      let step_id = step_for_session.id;
      delete step_for_session.id;
      step_for_session.inputs = JSON.parse(step_for_session.inputs);
      step_for_session.parents = step_for_session.parents.split(",").map(function (item) {
        return parseInt(item.trim());
      });
      formatted_steps_for_session[step_id] = step_for_session;
    }
    formatted_steps[session_num] = formatted_steps_for_session;
  }
  formData.steps = formatted_steps;
  return formData;
}

export class Home extends Component {
  updateFormData = (form) => {
    var formData = form.formData;
    var file_name = formData.name;
    delete formData.name;

    var resultFormData = JSON.stringify(convertToPipelineFormat(form.formData), null, 2);
    var fileDownload = require('js-file-download');
    fileDownload(resultFormData, file_name + '.json');
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}> Create Pipeline </h1>
        <Form schema={schema}
          uiSchema={uiSchema}
          onChange={log("changed")}
          onSubmit={this.updateFormData}
          onError={log("errors")}
        />
      </div>
    )
  }
}

export default Home

