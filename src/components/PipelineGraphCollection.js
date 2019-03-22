import React, { Component } from 'react'
import PipelineGraph from './PipelineGraph'
import Popup from 'reactjs-popup'
import { convertToPipelineFormat } from './utils';

export class PipelineGraphCollection extends Component {
  stepsForEachSession = (pipelineData) => {
    var GraphArray = []
    var pipelineDataSteps = pipelineData.steps

    for (var session_num in pipelineDataSteps) {
      let header = "Session #" + session_num;
      let steps_for_session = pipelineDataSteps[session_num]
      GraphArray.push(<PipelineGraph key={"session_" + session_num} header={header} steps={steps_for_session}></PipelineGraph>)
    }
    return GraphArray
  }

  render() {
    return (
      <Popup
        trigger={<span> View graphs </span>}
        modal
        lockScroll={true}
        contentStyle={{ height: "90%", overflowY: "scroll" }}
        closeOnDocumentClick>
        {this.props.valid ? this.stepsForEachSession(convertToPipelineFormat(this.props.steps)) : <span style={{ color: "red" }}>The form needs to be valid for the graphs to work</span>}
      </Popup>
    )
  }
}

export default PipelineGraphCollection
