// Validation is done on the pipeline json format and not on the formdata format.
import test_pipeline from './test_pipeline';

const valid_predecessors = {
    'dummy': [undefined, []],
    'resample': ['dummy'],
    'vad': ['resample'],
    'diarization': ['resample'],
    'decoder': ['resample', 'vad', 'diarization']
}

export function validate_parents_exist(steps) {

    let step_ids = Object.keys(steps).map(key => parseInt(key));

    for (var step_id in steps) {
        let step = steps[step_id];
        if (step.parent_id) {
            for (var parent_id of step.parent_id) {
                if (!step_ids.includes(parent_id)) {
                    return false;
                }
            }
        }
    }
    return true;
}

export function validate_predecessor_tasks(steps) {
    for (var step_id in steps) {
        let step = steps[step_id];
        if (step.parent_id) {
            for (var parent_id of step.parent_id) {
                let valid_predecessors_for_step = valid_predecessors[step.task_type]
                if (!valid_predecessors_for_step.includes(steps[parent_id].task_type)) {
                    return false;
                }
            }
        }

    }
    return true;
}

export function validate_all() {
    const test_pipeline_steps = test_pipeline.steps
    for (var session_num in test_pipeline_steps) {
        console.log("validate parents exist")
        console.log(validate_parents_exist(test_pipeline_steps[session_num]))
        console.log("validate predecesor")
        console.log(validate_predecessor_tasks(test_pipeline_steps[session_num]))
    }
}

