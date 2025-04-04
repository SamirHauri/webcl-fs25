import {VALUE, VALID, EDITABLE, LABEL} from "../../kolibri-dist-0.9.10/kolibri/presentationModel.js";

export { personTableProjector, personDivProjector, personFormProjector }

// Helper functions for binding
const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));
};

// Helper to display text with binding
const personTextElement = (textAttr, isInput = true) => {
    if (isInput) {
        const inputElement = document.createElement("INPUT");
        inputElement.type = "text";
        inputElement.size = 20;
        bindTextInput(textAttr, inputElement);
        return inputElement;
    } else {
        const spanElement = document.createElement("SPAN");
        textAttr.getObs(VALUE).onChange(text => spanElement.textContent = text);
        return spanElement;
    }
};

/**
 * Projector that creates a table to display and edit person list
 * with visualization of the selected row.
 */
const personTableProjector = (masterController, selectionController, rootElement) => {
    // Create table structure
    const table = document.createElement("TABLE");
    const thead = document.createElement("THEAD");
    const tbody = document.createElement("TBODY");
    
    // Setup table header
    const headerRow = document.createElement("TR");
    const headers = ["", "First Name", "Last Name", ""];
    
    headers.forEach(headerText => {
        const th = document.createElement("TH");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    rootElement.appendChild(table);
    
    // Person row projector
    const renderPerson = person => {
        const row = document.createElement("TR");
        
        // Index column (empty)
        const indexCell = document.createElement("TD");
        row.appendChild(indexCell);
        
        // First name column
        const firstNameCell = document.createElement("TD");
        const firstNameInput = personTextElement(person.firstname);
        firstNameCell.appendChild(firstNameInput);
        row.appendChild(firstNameCell);
        
        // Last name column
        const lastNameCell = document.createElement("TD");
        const lastNameInput = personTextElement(person.lastname);
        lastNameCell.appendChild(lastNameInput);
        row.appendChild(lastNameCell);
        
        // Delete button column
        const deleteCell = document.createElement("TD");
        const deleteButton = document.createElement("BUTTON");
        deleteButton.setAttribute("class", "delete");
        deleteButton.innerHTML = "&times;";
        deleteButton.onclick = _ => masterController.removePerson(person);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        
        // Handle selection
        row.onclick = _ => selectionController.setSelectedPerson(person);
        
        // Update row styling when selection changes
        selectionController.onPersonSelected(selected => {
            if (selected === person) {
                row.classList.add("selected");
            } else {
                row.classList.remove("selected");
            }
        });
        
        // Handle person removal
        masterController.onPersonRemove((removedPerson, removeMe) => {
            if (removedPerson !== person) return;
            tbody.removeChild(row);
            // Clear selection if the removed person was selected
            if (selectionController.getSelectedPerson() === person) {
                selectionController.clearSelection();
            }
            removeMe();
        });
        
        tbody.appendChild(row);
    };
    
    // Bind to model for rendering new persons
    masterController.onPersonAdd(renderPerson);
    
    return {
        add: renderPerson
    };
};

/**
 * Projector that creates a grid with divs to display and edit person list
 * with visualization of the selected row using div elements and subgrid.
 */
const personDivProjector = (masterController, selectionController, rootElement) => {
    // Create grid container
    const gridContainer = document.createElement("DIV");
    gridContainer.classList.add("person-grid");
    
    // Add header row
    const headerRow = document.createElement("DIV");
    headerRow.classList.add("row");
    
    const headers = ["", "First Name", "Last Name", ""];
    headers.forEach(headerText => {
        const headerCell = document.createElement("DIV");
        headerCell.classList.add("header");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    
    gridContainer.appendChild(headerRow);
    rootElement.appendChild(gridContainer);
    
    // Person row projector
    const renderPerson = person => {
        const row = document.createElement("DIV");
        row.classList.add("row");
        
        // Index column (empty)
        const indexCell = document.createElement("DIV");
        row.appendChild(indexCell);
        
        // First name column
        const firstNameCell = document.createElement("DIV");
        const firstNameInput = personTextElement(person.firstname);
        firstNameCell.appendChild(firstNameInput);
        row.appendChild(firstNameCell);
        
        // Last name column
        const lastNameCell = document.createElement("DIV");
        const lastNameInput = personTextElement(person.lastname);
        lastNameCell.appendChild(lastNameInput);
        row.appendChild(lastNameCell);
        
        // Delete button column
        const deleteCell = document.createElement("DIV");
        const deleteButton = document.createElement("BUTTON");
        deleteButton.setAttribute("class", "delete");
        deleteButton.innerHTML = "&times;";
        deleteButton.onclick = _ => masterController.removePerson(person);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        
        // Handle selection
        row.onclick = _ => selectionController.setSelectedPerson(person);
        
        // Update row styling when selection changes
        selectionController.onPersonSelected(selected => {
            if (selected === person) {
                row.classList.add("selected");
            } else {
                row.classList.remove("selected");
            }
        });
        
        // Handle person removal
        masterController.onPersonRemove((removedPerson, removeMe) => {
            if (removedPerson !== person) return;
            gridContainer.removeChild(row);
            // Clear selection if the removed person was selected
            if (selectionController.getSelectedPerson() === person) {
                selectionController.clearSelection();
            }
            removeMe();
        });
        
        gridContainer.appendChild(row);
    };
    
    // Bind to model for rendering new persons
    masterController.onPersonAdd(renderPerson);
    
    return {
        add: renderPerson
    };
};

/**
 * Projector for the detail form
 */
const personFormProjector = (detailController, rootElement, person) => {
    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="detail-form">
            <LABEL for="firstname"></LABEL>
            <INPUT TYPE="text" size="20" id="firstname">   
            <LABEL for="lastname"></LABEL>
            <INPUT TYPE="text" size="20" id="lastname">   
        </DIV>
    </FORM>`;
    
    // Bind text values
    const firstnameInput = divElement.querySelector('#firstname');
    bindTextInput(person.firstname, firstnameInput);
    
    const lastnameInput = divElement.querySelector('#lastname');
    bindTextInput(person.lastname, lastnameInput);
    
    // Bind label values
    const firstnameLabel = divElement.querySelector('label[for="firstname"]');
    person.firstname.getObs(LABEL).onChange(label => firstnameLabel.textContent = label);
    
    const lastnameLabel = divElement.querySelector('label[for="lastname"]');
    person.lastname.getObs(LABEL).onChange(label => lastnameLabel.textContent = label);
    
    // Replace existing content
    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
}; 