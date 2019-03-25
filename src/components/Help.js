import React, { Component } from 'react'
import Popup from "reactjs-popup"

export class Help extends Component {
    render() {
        return (
            <Popup
                trigger={<span> Help </span>}
                modal
                contentStyle={{ height: "90%", overflowY: "scroll" }}
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
        )
    }
}

export default Help
