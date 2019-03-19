export const test_pipeline = {
  "version": "0.0.1",
  "metadata": {
    "date": "28-nov-2018",
    "session": [
      {
        "ceiling": {
          "filename": "data/181204_142512-m.WAV",
          "channels": [
            1,
            2
          ],
          "type": "cm",
          "lang": "sge",
          "asr_type": "lvscr"
        },
        "table": {
          "filename": "data/181204_142459-s.WAV",
          "channels": [
            1,
            2
          ],
          "type": "tm",
          "lang": "sge",
          "asr_type": "lvscr"
        }
      },
      {
        "ceiling": {
          "filename": "data/181204_144601-m.WAV",
          "channels": [
            1,
            2
          ],
          "type": "cm",
          "lang": "sge",
          "asr_type": "lvscr"
        },
        "table": {
          "filename": "data/181204_144549-s.WAV",
          "channels": [
            1,
            2
          ],
          "type": "tm",
          "lang": "sge",
          "asr_type": "lvscr"
        },
        "closetalk": {
          "filename": "data/181204_144549-s.WAV",
          "channels": [
            6,
            7
          ],
          "type": "ct",
          "lang": "sge",
          "asr_type": "lvscr"
        }
      }
    ]
  },
  "steps": {
    "2": {
      "1": {
        "task_type": "dummy",
        "inputs": {}
      },
      "2": {
        "task_type": "resample",
        "parent_id": [
          1
        ],
        "inputs": {
          "mic_name": "ceiling"
        }
      },
      "3": {
        "task_type": "resample",
        "parent_id": [
          1
        ],
        "inputs": {
          "mic_name": "table"
        }
      },
      "4": {
        "task_type": "vad",
        "parent_id": [
          2
        ],
        "inputs": {
          "mic_name": "ceiling"
        }
      },
      "5": {
        "task_type": "diarization",
        "parent_id": [
          3
        ],
        "inputs": {
          "mic_name": "table",
          "speaker_id": 1
        }
      },
      "6": {
        "task_type": "diarization",
        "parent_id": [
          3
        ],
        "inputs": {
          "mic_name": "table",
          "speaker_id": 2
        }
      },
      "7": {
        "task_type": "decoder",
        "parent_id": [
          5,
          4
        ],
        "inputs": {
          "seg": {
            "mic_name": "table",
            "source": "diarization",
            "speaker_id": 1
          },
          "wav": {
            "mic_name": "ceiling",
            "source": "vad",
            "speaker_id": 1
          }
        }
      },
      "8": {
        "task_type": "decoder",
        "parent_id": [
          6,
          4
        ],
        "inputs": {
          "seg": {
            "mic_name": "table",
            "speaker_id": 2,
            "source": "diarization"
          },
          "wav": {
            "mic_name": "ceiling",
            "speaker_id": 2,
            "source": "vad"
          }
        }
      }
    },
    "1": {
      "1": {
        "task_type": "dummy",
        "inputs": {}
      },
      "2": {
        "task_type": "resample",
        "parent_id": [
          1
        ],
        "inputs": {
          "mic_name": "ceiling"
        }
      },
      "3": {
        "task_type": "resample",
        "parent_id": [
          1
        ],
        "inputs": {
          "mic_name": "table"
        }
      },
      "4": {
        "task_type": "vad",
        "parent_id": [
          2
        ],
        "inputs": {
          "mic_name": "ceiling"
        }
      },
      "5": {
        "task_type": "diarization",
        "parent_id": [
          3
        ],
        "inputs": {
          "mic_name": "table",
          "speaker_id": 1
        }
      },
      "6": {
        "task_type": "diarization",
        "parent_id": [
          3
        ],
        "inputs": {
          "mic_name": "table",
          "speaker_id": 2
        }
      },
      "7": {
        "task_type": "decoder",
        "parent_id": [
          5,
          4
        ],
        "inputs": {
          "seg": {
            "mic_name": "table",
            "source": "diarization",
            "speaker_id": 1
          },
          "wav": {
            "mic_name": "ceiling",
            "source": "vad",
            "speaker_id": 1
          }
        }
      },
      "8": {
        "task_type": "decoder",
        "parent_id": [
          6,
          4
        ],
        "inputs": {
          "seg": {
            "mic_name": "table",
            "speaker_id": 2,
            "source": "diarization"
          },
          "wav": {
            "mic_name": "ceiling",
            "speaker_id": 2,
            "source": "vad"
          }
        }
      }
    }
  }
}


export default test_pipeline