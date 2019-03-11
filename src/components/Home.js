import React, { Component } from 'react'
import Form from 'react-jsonschema-form-semanticui'

const schema = {
  "title": "",
  "type": "object",
  "required": [
    "version"
  ],
  "properties": {
    "version": {
      "type": "string",
      "title": "Version"
    },
    "metadata": {
      "type": "string",
      "format": "textarea",
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
                  "title": "Task"
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

const uiSchema = {
  "session_steps": {
    "items": {
      "steps": {
        "items": {
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
          onError={log("errors")} />
      </div>
    )
  }
}

export default Home

