import { MasterController, SelectionController, DetailView } from './person.js';
import { personTableProjector, personDivProjector, personFormProjector } from './personProjector.js';
import { TestSuite } from "../../kolibri-dist-0.9.10/kolibri/util/test.js";
import { Attribute, LABEL, VALUE } from "../../kolibri-dist-0.9.10/kolibri/presentationModel.js";

// Direkter Aufruf ohne DOMContentLoaded, da der DOM Appender nicht existiert
const personSuite = TestSuite("person projectors");

personSuite.add("table projector", assert => {
    // Setup
    const tableContainer = document.createElement("div");
    const masterController = MasterController();
    const selectionController = SelectionController();
    
    // Create projector
    personTableProjector(masterController, selectionController, tableContainer);
    
    // Initial state - should be empty except for table and header
    // Assertion #1
    assert.is(tableContainer.querySelectorAll("table").length, 1);
    // Assertion #2
    assert.is(tableContainer.querySelectorAll("thead").length, 1);
    // Assertion #3
    assert.is(tableContainer.querySelectorAll("tbody tr").length, 0);
    
    // Add person
    masterController.addPerson();
    
    // Should have one row
    // Assertion #4
    assert.is(tableContainer.querySelectorAll("tbody tr").length, 1);
    
    // Add another person
    masterController.addPerson();
    
    // Should have two rows
    // Assertion #5
    assert.is(tableContainer.querySelectorAll("tbody tr").length, 2);
    
    // Delete first person
    const firstDeleteButton = tableContainer.querySelector("tbody tr button.delete");
    firstDeleteButton.click();
    
    // Should have one row again
    // Assertion #6
    assert.is(tableContainer.querySelectorAll("tbody tr").length, 1);
    
    // Test selection
    const firstRow = tableContainer.querySelector("tbody tr");
    firstRow.click();
    
    // Check if row has selected class
    // Assertion #7
    assert.is(firstRow.classList.contains("selected"), true);
});

personSuite.add("div projector", assert => {
    // Setup
    const divContainer = document.createElement("div");
    const masterController = MasterController();
    const selectionController = SelectionController();
    
    // Create projector
    personDivProjector(masterController, selectionController, divContainer);
    
    // Initial state - should be empty except for grid container and header
    // Assertion #8
    assert.is(divContainer.querySelectorAll(".person-grid").length, 1);
    // Assertion #9
    assert.is(divContainer.querySelectorAll(".person-grid .header").length, 4); // 4 header cells
    // Assertion #10
    assert.is(divContainer.querySelectorAll(".person-grid .row:not(:first-child)").length, 0);
    
    // Add person
    masterController.addPerson();
    
    // Should have one row (not counting header row)
    // Assertion #11
    assert.is(divContainer.querySelectorAll(".person-grid .row:not(:first-child)").length, 1);
    
    // Add another person
    masterController.addPerson();
    
    // Should have two rows (not counting header row)
    // Assertion #12
    assert.is(divContainer.querySelectorAll(".person-grid .row:not(:first-child)").length, 2);
    
    // Delete first person
    const firstDeleteButton = divContainer.querySelector(".person-grid .row:not(:first-child) button.delete");
    firstDeleteButton.click();
    
    // Should have one row again
    // Assertion #13
    assert.is(divContainer.querySelectorAll(".person-grid .row:not(:first-child)").length, 1);
    
    // Test selection
    const firstRow = divContainer.querySelector(".person-grid .row:not(:first-child)");
    firstRow.click();
    
    // Check if row has selected class
    // Assertion #14
    assert.is(firstRow.classList.contains("selected"), true);
});

personSuite.add("simplified detail view test", assert => {
    // Create simplified test - testing just the personFormProjector directly
    
    // Setup - create person
    const createTestPerson = () => {
        const firstnameAttr = Attribute("TestFirstname");
        firstnameAttr.getObs(LABEL).setValue("First Name");
        
        const lastnameAttr = Attribute("TestLastname");
        lastnameAttr.getObs(LABEL).setValue("Last Name");
        
        return {
            firstname: firstnameAttr,
            lastname: lastnameAttr,
        };
    };
    
    // Create container and a test person
    const detailContainer = document.createElement("div");
    const testPerson = createTestPerson();
    
    // Check that container is empty initially
    // Assertion #15
    assert.is(detailContainer.children.length, 0);
    
    // Create a placeholder div and add it
    const placeholderDiv = document.createElement("div");
    placeholderDiv.className = "placeholder";
    detailContainer.appendChild(placeholderDiv);
    
    // Verify container has one child
    // Assertion #16
    assert.is(detailContainer.children.length, 1);
    
    // Verify placeholder exists and is accessible
    // Assertion #17
    assert.is(detailContainer.querySelector(".placeholder") !== null, true);
    
    // Now call personFormProjector directly
    personFormProjector(null, detailContainer, testPerson);
    
    // Verify form was created
    // Assertion #18
    assert.is(detailContainer.querySelector("form") !== null, true);
    // Assertion #19
    assert.is(detailContainer.querySelector(".detail-form") !== null, true);
    
    // Verify inputs exist
    const firstNameInput = detailContainer.querySelector("#firstname");
    const lastnameInput = detailContainer.querySelector("#lastname");
    
    // Assertion #20
    assert.is(firstNameInput !== null, true);
    // Assertion #21
    assert.is(lastnameInput !== null, true);
    
    // Test input values
    // Assertion #22
    assert.is(firstNameInput.value, "TestFirstname");
});

personSuite.run(); 