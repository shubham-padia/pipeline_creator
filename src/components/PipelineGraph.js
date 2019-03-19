import React, { Component } from 'react'
import Graph from 'react-graph-vis'

var options = {
    layout: {
        hierarchical: {
            "direction": "LR",
            "sortMethod": "directed",
        }
    },
    edges: {
        color: "#000000"
    },
    width: "100%",
    height: "400px"
};

var events = {
    select: function (event) {
        var { nodes, edges } = event;
    }
}

const steps = {
    "1": {
        "task_type": "dummy",
        "inputs": {},
        "parent_id": []
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



export class PipelineGraph extends Component {
    constructGraphFromSteps = (steps) => {
        console.log(steps)
        var nodes = [];
        var edges = [];

        for (var step_id in steps) {
            let step = steps[step_id]
            let node = { id: step_id, label: step.task_type + '_' + step_id };
            nodes.push(node);
            if(step.parent_id) {
                for (var parent_id of step.parent_id) {
                    edges.push({ from: parent_id, to: step_id });
                }
            }
            
        }

        return { nodes: nodes, edges: edges };
    }

    render() {
        return (
            <div>
                <h1>{this.props.header}</h1>
                <Graph graph={this.constructGraphFromSteps(this.props.steps)} options={options} events={events} />
            </div>
        )
    }
}

export default PipelineGraph
