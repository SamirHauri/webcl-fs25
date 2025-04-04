import { MasterController, SelectionController, DetailView } from './person.js';
import { personTableProjector, personDivProjector } from './personProjector.js';

// Create controllers
const masterController    = MasterController();
const selectionController = SelectionController();

// Create the table view
personTableProjector(
    masterController, 
    selectionController, 
    document.getElementById('tableContainer')
);

// Create the div grid view
personDivProjector(
    masterController, 
    selectionController, 
    document.getElementById('divContainer')
);

// Create the detail view
DetailView(selectionController, document.getElementById('detailContainer'));

// Bind the "+" button for adding new persons
document.getElementById('plus').onclick = _ => masterController.addPerson();

// Add some initial persons
masterController.addPerson();
masterController.addPerson();
