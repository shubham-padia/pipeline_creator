// Validation is done on the pipeline json format and not on the formdata format.
import { valid_predecessors } from './SchemaDefinitions';

export function validate_parents_exist(steps) {
    for (var session_num in steps) {
        var steps_for_session = steps[session_num];
        let step_ids = Object.keys(steps_for_session).map(key => parseInt(key));
        for (var step_id in steps_for_session) {
            let step = steps_for_session[step_id];
            if (step.parent_id) {
                for (var parent_id of step.parent_id) {
                    if (!step_ids.includes(parent_id)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

export function validate_predecessor_tasks(steps) {
    for (var session_num in steps) {
        var steps_for_session = steps[session_num];

        for (var step_id in steps_for_session) {
            let step = steps_for_session[step_id];

            if (step.parent_id) {
                for (var parent_id of step.parent_id) {
                    let valid_predecessors_for_step = valid_predecessors[step.task_type]
                    if (!valid_predecessors_for_step.includes(steps_for_session[parent_id].task_type)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

export function validate_unique_session_numbers(formData) {
    let session_num_collection = [];
    for (var steps_session_info of formData.steps) {
        session_num_collection.push(steps_session_info.session_num);
    }
    let session_num_set = new Set(session_num_collection);
    return (session_num_collection.length === session_num_set.size)
}


export function validate_unique_step_ids(formData) {
    for (var steps_session_info of formData.steps) {
        let session_step_collection = [];

        for (var step_for_session of steps_session_info.steps_for_session) {
            let step_id = step_for_session.id;
            session_step_collection.push(step_id);
        }
        let session_step_set = new Set(session_step_collection);

        if (session_step_set.size !== session_step_collection.length) {
            return false;
        }
    }

    return true;
}

export function validate_all(steps, formData) {
    let errors = [];

    if (!validate_unique_session_numbers(formData)) {
        errors.push("Session numbers should be unique.");
    }

    if (!validate_unique_step_ids(formData)) {
        errors.push("Step ids should be unique.");
    }

    if (!validate_parents_exist(steps)) {
        errors.push("Parents do not exist.");
    } else if (!validate_predecessor_tasks(steps)) {
        errors.push("Predecessor tasks do not exist.");
    }

    return errors;
}

export function validate_all_boolean(steps, formData) {
    let error_array = validate_all(steps, formData);
    return (Array.isArray(error_array) && !error_array.length);
}
