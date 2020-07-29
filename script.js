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

  static createInfoItem(name, value, list) {
    const infoElement = document.createElement('li');
    infoElement.textContent = `${name}: ${value}`;
    list.append(infoElement);
  }
}

class Tooltip {
  constructor(element) {
    this.name = element.querySelector('.cat__name').textContent;
    this.age = element.dataset.age;
    this.sex = element.dataset.sex;
    this.color = element.dataset.color;
    this.createInfo();
  }

  createInfo() {
    this.popup = document.querySelector('.popup');
    this.list = this.popup.querySelector('.cat-info');
    DOMHelper.createInfoItem('Name', this.name, this.list);
    DOMHelper.createInfoItem('Age', this.age, this.list);
    DOMHelper.createInfoItem('Sex', this.sex, this.list);
    DOMHelper.createInfoItem('Color', this.color, this.list);
    this.popup.classList.add('popup_visible');
    this.popup.addEventListener('click', this.closeTooltip.bind(this));
  }

  closeTooltip() {
    this.popup.classList.remove('popup_visible');
    setTimeout(() => (this.list.textContent = ''), 300);
  }
}

class Cat {
  constructor(id, element, moveFunction, type) {
    this.id = id;
    this.element = element;
    this.moveFunction = moveFunction;
    this.moveButtonInit(type);
    this.infoButtonInit();
  }

  infoButtonInit() {
    const infoButton = this.element.querySelector('.cat__info');
    infoButton.addEventListener('click', this.showInfo.bind(this));
  }

  showInfo() {
    const info = new Tooltip(this.element);
  }

  moveButtonInit(type) {
    let moveButton = this.element.querySelector('.cat__move');
    moveButton = DOMHelper.clearButton(moveButton);
    moveButton.textContent = type === 'shelter' ? 'To Vet' : 'To Shelter';
    moveButton.classList.add(
      type === 'shelter' ? 'button_to-vet' : 'button_to-shelter'
    );
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
    cat.element.classList.add('fadeIn');
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
    vetCatsList.assignMoveFunction(
      shelterCatsList.addCat.bind(shelterCatsList)
    );
  }
}

CatApp.init();
