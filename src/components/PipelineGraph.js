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

export class PipelineGraph extends Component {
    constructGraphFromSteps = (steps) => {
        var nodes = [];
        var edges = [];

        for (var step_id in steps) {
            let step = steps[step_id];
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
                <Graph graph={this.constructGraphFromSteps(this.props.steps)} options={options} />
            </div>
        )
    }
}

export default PipelineGraph
