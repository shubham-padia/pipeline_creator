import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css';
import Popup from "reactjs-popup";

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
              "required": [
                "id",
                'task_type',
                'inputs'
              ],
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
                "parent_id": {
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
    "ui:options": {
      "orderable": false
    },
    "items": {
      classNames: "object",
      "steps_for_session": {
        "ui:options": {
          "orderable": false
        },
        "items": {
          classNames: "object",
          "id": twoWide,
          "task_type": twoWide,
          "parent_id": twoWide,
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
        <div style={{marginBottom: "30px"}}>
        <h1 style={{ textAlign: "center", margin: "auto", display: "inline" }} > Create Pipeline </h1>
        <Popup
          trigger={<button className="help-button btn btn-info"> Help </button>}
          modal
          closeOnDocumentClick>
          <div style={{whiteSpace: "pre"}}>
            <h3> {"Input Formats:"} </h3>
            <h5>{"dummy:"}</h5>
            {'{}'}
            <h5>{"resample:"}</h5>
            {'{"mic_name": ""}'}
            <h5>{"vad:"}</h5>
            {'{"mic_name": ""}'}
            <h5>{"diarization:"}</h5>
            {'{\
              \n    "mic_name": "table",\
              \n    "speaker_id": 1\
              \n}'}
            <h5>{"decoder:"}</h5>
            {'{\
            \n    "seg": { \
            \n        "mic_name": "table", \
            \n        "source": "diarization", \
            \n        "speaker_id": 1 \
            \n    }, \
            \n    "wav": { \
            \n        "mic_name": "ceiling", \
            \n        "source": "vad", \
            \n        "speaker_id": 1 \
            \n    } \
            \n}'}
          </div>
        </Popup>
        </div>
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

