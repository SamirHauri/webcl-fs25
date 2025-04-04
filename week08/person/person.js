import { ObservableList, Observable }                   from "../../kolibri-dist-0.9.10/kolibri/observable.js";
import { Attribute, LABEL }                             from "../../kolibri-dist-0.9.10/kolibri/presentationModel.js";
import { personFormProjector }                          from "./personProjector.js";

export { MasterController, SelectionController, DetailView }

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Monika");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    // lastnameAttr.setConverter( input => input.toUpperCase() );
    // lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
    }
};

const MasterController = () => {

    const personListModel = ObservableList([]); // observable array of Persons, this state is private

    return {
        addPerson:            () => personListModel.add(Person()),
        removePerson:         personListModel.del,
        onPersonAdd:          personListModel.onAdd,
        onPersonRemove:       personListModel.onDel,
    }
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    johnDoe.firstname.setConvertedValue("");
    johnDoe.lastname.setConvertedValue("");
    return johnDoe;
})();

const SelectionController = () => {

    const selectedPersonObs = Observable(NoPerson);

    return {
        setSelectedPerson : selectedPersonObs.setValue,
        getSelectedPerson : selectedPersonObs.getValue,
        onPersonSelected:   selectedPersonObs.onChange,
        clearSelection:     () => selectedPersonObs.setValue(NoPerson),
    }
};

const DetailView = (selectionController, rootElement) => {

    const render = person =>
        personFormProjector(selectionController, rootElement, person);

    selectionController.onPersonSelected(render);
};
