import { cloneDeep } from 'lodash';

export function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function convertToPipelineFormat(formDataOriginal) {
    //make sure we don't make any changes to the object which has been passed as a reference.
    var formData = cloneDeep(formDataOriginal);

    var formatted_steps = {};
    if (isEmpty(formData)) {
        return formData;
    }
    formData.metadata = JSON.parse(formData.metadata)
    for (var steps_session_info of formData.steps) {
        var formatted_steps_for_session = {};
        var session_num = steps_session_info.session_num;

        for (var step_for_session of steps_session_info.steps_for_session) {
            let step_id = step_for_session.id;
            delete step_for_session.id;
            step_for_session.inputs = JSON.parse(step_for_session.inputs);

            if (step_for_session.parent_id !== undefined) {
                step_for_session.parent_id = step_for_session.parent_id.split(",").map(function (item) {
                    return parseInt(item.trim());
                });
            }
            formatted_steps_for_session[step_id] = step_for_session;
        }
        formatted_steps[session_num] = formatted_steps_for_session;
    }
    formData.steps = formatted_steps;
    return formData;
}