export const schema = {
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

export const uiSchema = {
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

export const valid_predecessors = {
    'dummy': [undefined, []],
    'resample': ['dummy'],
    'vad': ['resample'],
    'diarization': ['resample'],
    'decoder': ['resample', 'vad', 'diarization']
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
    }
}

