class Person {
    constructor(surname, name, patronymic) {
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
    }
}

export default class Child extends Person{
    constructor(surname, name, patronymic, age) {
        super(surname, name, patronymic, age);
    }

    #age;

    get child() {
        this.#age = 10;
        return this.#age;
    }
}