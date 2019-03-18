import React, { Component } from 'react'
import Popup from "reactjs-popup"

export class Help extends Component {
    render() {
        return (
            <div style={{ marginBottom: "30px" }}>
                <h1 style={{ textAlign: "center", margin: "auto", display: "inline" }} > Create Pipeline </h1>
                <Popup
                    trigger={<button className="help-button btn btn-info"> Help </button>}
                    modal
                    closeOnDocumentClick>
                    <div style={{ whiteSpace: "pre" }}>
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
        )
    }
}

export default Help
