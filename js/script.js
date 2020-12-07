const storage = window.localStorage;
const form = document.querySelector('form');
const buttonSave = document.querySelector('#save');
const alertBox = document.querySelector(".alert");
const tbody = document.querySelector('tbody');

const addRow = (item) => {
    const button = '<td><button type="button" class="button"><i class="fas fa-pen"></i></button><button type="button" class="button" onclick="deleteItem(this, '+item.id+')"><i class="fas fa-trash"></i></button></td>';
    let tr = "<tr>";
        tr += "<td>" + item.employee + "</td>";
        tr += "<td>" + item.building + "</td>";
        tr += "<td>" + item.workPlaces + "</td>";
        tr +=button;
    tr += "</tr>"
    return tbody.innerHTML += tr;
}

const displayAlert = message => {
    alertBox.innerText = message;
    alertBox.style.display = "block";
    setTimeout(function() {
      alertBox.style.display = "none";
    }, 4000);
};

const getFormData = () => {
    let data = { [form]: {} };
    const elements = form.elements;
    for (const element of elements) {
      if (element.name.length > 0) {
        data[form][element.name] = element.value;
      }
    }
    return data[form];
};

const deleteItem = async (btn, id) => {
    const isRemove = confirm("Este item será removido");
    if(isRemove) {
        var row = btn.parentNode.parentNode;
        row.parentNode.removeChild(row);
        var items = await JSON.parse(storage.getItem("items"));
        
        if(items) {
            items.map((item, key) => {
                if(item.id === id) {
                    items.splice(key,1);
                }
            });
            items = JSON.stringify(items);
            localStorage.setItem('items', items);
        }
    }
}

buttonSave.onclick = async (event) => {
    event.preventDefault();
    const data = getFormData();
    if(data.employee !== "" && data.building !== "" && data.workPlaces !== "") {
        const items = await JSON.parse(storage.getItem("items"));
        if(items) {
            storage.setItem("items", JSON.stringify([...items, {id: items.length + 1, ...data}]));
        }else{
            storage.setItem("items", JSON.stringify([{id:1, ...data}]));
        }
        addRow(data);
        displayAlert("Registro cadastrado com sucesso!");
        form.reset();
        form.elements[0].focus();
    } else{
        alert("Dados inválidos, tente novamente!");
    }
}

window.onload = async function() {
    const items = await JSON.parse(storage.getItem("items"));
    if(items) {
        for(const item of items) {
            addRow(item);
        }
    }
};

