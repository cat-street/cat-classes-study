class DOMHelper {
  static moveElement(element, place) {
    const newPlace = document.querySelector(place);
    newPlace.append(element);
  }

  static clearButton(element) {
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
    clone.className = 'button cat__move';
    return clone;
  }
}

class Tooltip {}

class Cat {
  constructor(id, element, moveFunction, type) {
    this.id = id;
    this.element = element;
    this.moveFunction = moveFunction;
    this.moveButtonInit(type);
  }

  infoButtonInit() {
    const infoButton = this.element.querySelector('.cat__info');
  }

  moveButtonInit(type) {
    let moveButton = this.element.querySelector('.cat__move');
    moveButton = DOMHelper.clearButton(moveButton);
    moveButton.textContent = type === 'shelter' ? 'To Vet' : 'To Shelter';
    moveButton.classList.add(type === 'shelter' ? 'button_to-vet' : 'button_to-shelter');
    moveButton.addEventListener('click', this.moveFunction.bind(null, this.id));
  }

  update(updatedFunction, type) {
    this.moveFunction = updatedFunction;
    this.moveButtonInit(type);
  }
}

class CatList {
  constructor(type) {
    this.cats = [];
    this.type = type;
    const selectedCats = document.querySelectorAll(
      `.cats_type_${this.type} .cat`
    );
    selectedCats.forEach((element) => {
      this.cats.push(
        new Cat(element.id, element, this.moveCat.bind(this), this.type)
      );
    });
  }

  assignMoveFunction(moveFunction) {
    this.moveFunction = moveFunction;
  }

  addCat(cat) {
    this.cats.push(cat);
    DOMHelper.moveElement(cat.element, `.cats_type_${this.type}`);
    cat.update(this.moveCat.bind(this), this.type);
  }

  moveCat(catId) {
    this.moveFunction(this.cats.find((element) => element.id === catId));
    this.cats = this.cats.filter((element) => element.id !== catId);
  }
}

class CatApp {
  static init() {
    const shelterCatsList = new CatList('shelter');
    const vetCatsList = new CatList('vet');
    shelterCatsList.assignMoveFunction(vetCatsList.addCat.bind(vetCatsList));
    vetCatsList.assignMoveFunction(shelterCatsList.addCat.bind(shelterCatsList));
  }
}

CatApp.init();
