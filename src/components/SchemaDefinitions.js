export const schema = {
  "title": "",
  "type": "object",
  "required": [
    "recording_id",
    "pipeline_id",
    "version",
    "metadata",
    "steps"
  ],
  "properties": {
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
                  "enum": ["dummy", "resample", "vad", "diarization", "decoder", "decoder_post_processing"],
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
    },
    "version": {
      "type": "string",
      "title": "Version",
      "enum": ["0.0.4"]
    },
    "recording_id": {
      "type": "string",
      "title": "Recording ID"
    },
    "pipeline_id": {
      "type": "string",
      "title": "Pipeline ID"
    },
    "metadata": {
      "type": "string",
      "title": "Metadata"
    }
  }
};

const twoWide = {
  classNames: "col-md-2 step-field"
}

const infoField = {
  classNames: "info-field",
}

export const uiSchema = {
  "version": infoField,
  "recording_id": infoField,
  "pipeline_id": infoField,
  "metadata": {
    classNames: "info-field",
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 22
    }
  },
  "steps": {
    classNames: "steps",
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
            classNames: "col-md-6 step-field",
            "ui:widget": "textarea",
            "ui:options": {
              "rows": 4
            }
          }
        }
      }
    }
  }
};

export const valid_predecessors = {
  'dummy': [undefined, []],
  'resample': ['dummy'],
  'vad': ['resample'],
  'diarization': ['resample'],
  'decoder': ['resample', 'vad', 'diarization'],
  'decoder_post_processing': ['decoder']
}

export const input_formats = {
  'dummy': {},
  'resample': {
    "mic_name": ""
  },
  'vad': {
    "mic_name": ""
  },
  'diarization': {
    "mic_name": "",
    "speaker_id": ""
  },
  'decoder': {
    "seg": {
      "mic_name": "",
      "source": "",
      "speaker_id": ""
    },
    "wav": {
      "mic_name": "",
      "source": "",
      "speaker_id": ""
    }
  },
  "decoder_post_processing": {}
}

