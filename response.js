let url = "https://fhir.dicom.tw/fhir/QuestionnaireResponse";

var response = '{\
    "resourceType": "QuestionnaireResponse",\
    "questionnaire": "",\
    "status": "completed",\
    "subject": {\
        "reference": "",\
        "type": ""\
    },\
    "author": {\
        "reference": "",\
        "type": ""\
    },\
    "source": {\
        "reference": "",\
        "type": ""\
    },\
    "item": []\
}';

function post_response(questionnaire) {
    const plain_text = ['string', 'url', 'reference', 'quantity', 'choice', 'open-choice']; // 暫時不處理防呆
    const datetime_format = ['date', 'time', 'dateTime'];
    var res = JSON.parse(response);
    res.questionnaire = questionnaire.id;
    res.subject.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.subject.type = questionnaire.subjectType[0];
    res.author.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.author.type = questionnaire.subjectType[0];
    res.source.reference = questionnaire.subjectType[0] + "/" + document.getElementById("subject_id").value.trim();
    res.source.type = questionnaire.subjectType[0];
    var question_list = document.getElementsByTagName("li");
    for (let i = 0; i < question_list.length; i++) {
        let this_question = questionnaire.item[i];
        let this_answer = question_list.item(i);
        let expected_type = this_question.type;
        let items = {
            "linkId": "",
            "text": "",
            "answer": []
        }
        items.linkId = this_question.linkId;
        items.text = this_question.text;
        let valueType;
        /* this rule work well in all cases */
        // this_question.required == true is a safer approach since this_question.required can be undefined in certain cases
        if (this_answer.children[1].value == "" && this_question.required == true) {
            output("Exception : incomplete input");
            return undefined;
        }
        // 
        if (plain_text.includes(expected_type)) {
            switch (expected_type) {
                case "string":
                case "choice":
                case "open-choice":
                    valueType = { "valueString": this_answer.children[1].value.trim() }
                    break;
                case "url":
                    valueType = { "valueUri": this_answer.children[1].value.trim() };
                    break;
                case "reference":
                    alert(expected_type);
                    if (this_answer.children[1].value.includes("/")) {
                        valueType = {
                            "valueReference": {
                                "reference": this_answer.children[1].value
                            }
                        };
                        alert("prsent");
                    } else if (this_question.required == true) {
                        output("Incompatible Format : Reference Type");
                        return undefined;
                    }
                    break;
                case "quantity":
                    valueType = { "valueQuantity": this_answer.children.value.trim() };
                    break;
            }
        } else if (expected_type == "integer") {
            valueType = { "valueInteger": parseInt(this_answer.children[1].value) };
        } else if (expected_type == "decimal") {
            valueType = { "valueDecimal": parseFloat(this_answer.children[1].value) };
        } else if (datetime_format.includes(expected_type)) {
            let isCorrect;
            switch (expected_type) {
                case "date":
                    isCorrect = checkDate(this_answer.children[1].value);
                    if (isCorrect)
                        valueType = { "valueDate": this_answer.children[1].value.trim() };
                    else if (this_question.required == true) {
                        output("Incompatible Format : Date Type");
                        return undefined;
                    }
                    break;
                case "time":
                    isCorrect = checkTime(this_answer.children[1].value);
                    if (isCorrect)
                        valueType = { "valueTime": this_answer.children[1].value.trim() };
                    else if (this_question.required == true) {
                        output("Incompatible Format : Time Type");
                        return undefined;
                    }
                    break;
                case "dateTime":
                    let dateTime_segment = this_answer.children[1].value.split("T");
                    if (dateTime_segment.length != 2) {
                        output("Incompatible Format : Time Type");
                        return undefined;
                    }
                    isCorrect = checkDate(dateTime_segment[0]) & checkTime(dateTime_segment[1]);
                    if (isCorrect) {
                        valueType = { "valueDateTime": this_answer.children[1].value.trim() };
                    } else if (this_question.required == true) {
                        output("Incompatible Format : Time Type");
                        return undefined;
                    }
                    break;
            }
        } else if (expected_type == "boolean") {
            bool_list = document.getElementsByName(this_question.linkId);
            if (bool_list[0].checked)
                valueType = { "valueBoolean": true };
            else if (bool_list[1].checked)
                valueType = { "valueBoolean": "false" }
            else if (this_question.required == true) {
                output("Incomplete Input : Radio Type");
                return undefined;
            }
        }
        if (expected_type == "group") { // checkbox
            let boxs = document.getElementsByName(this_question.linkId);
            let pushed = false;
            boxs.forEach(function(box) {
                if (box.checked) {
                    items.answer.push({ "valueString": box.value });
                    pushed = true;
                }
            });
            if (this_question.required == true && !pushed) {
                output("Incomplete Input : Checkbox Type");
                return undefined;
            }
        } else {
            console.table(valueType);
            items.answer.push(valueType);
        }

        res.item.push(items);
    }
    let dataStr = JSON.stringify(res);
    console.log(dataStr);
    HTTPPostData(url, dataStr, output);
}

function checkDate(value) {
    // currently only detect trivial error
    // others reserved for enhancement
    let date_segment = value.split("-");
    date_segment.map(function(element) {
        element = parseInt(element);
    });
    console.log(date_segment);
    if (date_segment.length != 3)
        return false;
    if (date_segment[0] < 1) // year
        return false;
    if (date_segment[1] < 1 || date_segment[1] > 12) // month
        return false;
    if (date_segment[2] < 1 || date_segment[2] > 31)
        return false;
    if (date_segment[1] == 2 && date_segment[2] > 29)
        return false;
    return true;
}

function checkTime(value) {
    // only check for format, timezone is currently ignore
    // no correction
    let time_segment = value.split(":");
    if (time_segment.length != 3)
        return false;
    if (time_segment[0] < 0 || time_segment[0] > 23)
        return false;
    if (time_segment[1] < 0 || time_segment[1] > 59)
        return false;
    if (time_segment[2] < 0 || time_segment[2] > 59)
        return false;
    return true;
}