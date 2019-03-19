import React, { Component } from 'react'
import PipelineGraph from './PipelineGraph'
import Popup from 'reactjs-popup'

export class PipelineGraphCollection extends Component {
  stepsForEachSession = (pipelineData) => {
    var GraphArray = []
    var pipelineDataSteps = pipelineData.steps
    console.log(pipelineDataSteps)
    for (var session_num in pipelineDataSteps) {
      let header = "Session #" + session_num;
      let steps_for_session = pipelineDataSteps[session_num]
      console.log("steps")
      console.log(steps_for_session)
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
          contentStyle={{height: "90%", overflowY: "scroll"}}
          closeOnDocumentClick>
            {this.stepsForEachSession(this.props.steps)}
        </Popup>
    )
  }
}

export default PipelineGraphCollection
