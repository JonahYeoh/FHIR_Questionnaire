function append_input(item, parentNode) {
    const text_set = ['valueString', 'date', 'dateTime', 'time', 'reference'];
    const number_set = ['integer', 'decimal'];
    const checkbox_set = ['group'];
    const radio_set = ['boolean'];
    let input_box = document.createElement("input");
    if (item.maxLength != undefined)
        input_box.setAttribute("maxlength", parseInt(item.maxLength));
    if (text_set.includes(item.type)) {
        input_box.type = "text";
        parentNode.appendChild(input_box);
    } else if (number_set.includes(item.type)) {
        input_box.type = "number";
        input_box.setAttribute("min", 0);
        parentNode.appendChild(input_box);
    } else if (checkbox_set.includes(item.type)) {
        for (let i = 0; i < item.answerOption.length; i++) {
            let checkbox = document.createElement("input");
            let checkbox_label = document.createElement("label");
            checkbox.type = "checkbox";
            checkbox.name = item.linkId;
            checkbox.value = item.answerOption[i].extension[0].valueString;
            checkbox_label.innerHTML = item.answerOption[i].extension[0].valueString;
            parentNode.appendChild(checkbox);
            parentNode.appendChild(checkbox_label);
        }
    } else if (radio_set.includes(item.type)) {
        let true_btn = document.createElement("input");
        let true_label = document.createElement("label");
        true_btn.type = "radio";
        true_btn.value = "true";
        true_btn.name = item.linkId;
        true_label.innerHTML = "TRUE";
        parentNode.appendChild(true_btn);
        parentNode.appendChild(true_label);
        let false_btn = document.createElement("input");
        let false_label = document.createElement("label");
        false_btn.type = "radio";
        false_btn.value = "false";
        false_btn.name = item.linkId;
        false_label.innerHTML = "FALSE";
        parentNode.appendChild(false_btn);
        parentNode.appendChild(false_label);
    }
}

function append_select(item, parentNode) {
    /* <select></select> */
    let select = document.createElement("select");
    /* 將問卷定義的選項逐個加入select */
    for (let op = 0; op < item.answerOption.length; op++) {
        /* <option value='xxx'>xxx</option> */
        let option = document.createElement("option");
        option.innerHTML = item.answerOption[op].extension[0].valueString;
        option.value = item.answerOption[op].extension[0].valueString;
        select.appendChild(option);
    }
    parentNode.appendChild(select);
}