import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import './home.css'
import 'bootstrap/dist/css/bootstrap.css';


function ArrayFieldTemplate(props) {
  var id = props.idSchema.$id
  var ArrayClassName = "col-md-5"
  var ButtonClassName = "col-md-1"

  if (id === 'root_session_steps') {
    ArrayClassName = "btn col-xs-9"
    ButtonClassName = "btn col-xs-1"
  }

  console.log(id)
  console.log(ArrayClassName, ButtonClassName)
  return (
    <div>
      {props.items.map(element => element.children)}
      {props.canAdd && <button type="button" className="btn btn-info btn-add col-xs-1" onClick={props.onAddClick}>
        <i class="glyphicon glyphicon-plus"></i>
      </button>
      }
      
    </div>
  );
}


const schema = {
  "title": "",
  "type": "object",
  "required": [
    "version"
  ],
  "properties": {
    "version": {
      "type": "string",
      "title": "Version",
      "enum": ["0.0.1"]
    },
    "metadata": {
      "type": "string",
      "title": "Metadata"
    },
    "session_steps": {
      "type": "array",
      "title": "Session Steps",
      "items": {
        "type": "object",
        "required": [
        ],
        "properties": {
          "session_num": {
            "type": "string",
            "title": "Session Number"
          },
          "steps": {
            "type": "array",
            "title": "Steps",
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
                  "enum": ["dummy", "resample", "vad", "diarization", "decoder"]
                },
                "parents": {
                  "type": "string",
                  "title": "Parents"
                },
                "inputs": {
                  "type": "string",
                  "title": "Inputs"
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
  "session_steps": {
    classNames: "col-md-11",
    "items": {
      "steps": {
        "items": {
          classNames: "col-md-6",
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

const log = (type) => console.log.bind(console, type);

export class Home extends Component {
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}> Create Pipeline </h1>
        <Form schema={schema}
          uiSchema={uiSchema}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")}
        />
      </div>
    )
  }
}

export default Home

