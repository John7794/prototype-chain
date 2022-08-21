class PrototypeChain {
    constructor(parent) {
        this.parent = parent;
    }

    #parent;

    set parent(val) {
        this.#parent = document.getElementById(val);
        if (!this.#parent) throw Error(`Елемент ${val} не знайдено!`);
    }

    get parent() {
        return this.#parent;
    }

    loadResource(src) {
        const LINK = document.createElement('link');
        
        LINK.setAttribute('href', src);
        LINK.setAttribute('rel', 'stylesheet');

        document.head.append(LINK);
    }

    createElement() {
        const BLOCK = document.createElement('div');
        const FORM = document.createElement('form');
        const FORM_BLOCK = document.createElement('div');
        const LABEL = document.createElement('label');
        const INPUT = document.createElement('input');
        const BUTTON = document.createElement('button');
        const OUTPUT = document.createElement('output');
        const STYLE = document.createElement('style');

        LABEL.textContent = 'Уведіть назву класу';
        BUTTON.textContent = 'Показати ланцюг прототипів';
        STYLE.textContent = 'body {height: 100vh; user-select: none;} ol {padding-left: 0px}';

        LABEL.classList.add('form-label', 'w-100', 'text-center');
        INPUT.classList.add('form-control', 'mt-2');
        BUTTON.classList.add('btn', 'btn-primary', 'w-100');
        FORM.classList.add('p-3', 'w-50');
        BLOCK.classList.add('d-flex', 'align-items-center', 'flex-column', 'h-100');
        OUTPUT.classList.add('w-50', 'p-3');
        this.parent.classList.add('pt-5');

        LABEL.append(INPUT);
        FORM_BLOCK.append(LABEL);
        FORM.append(FORM_BLOCK, BUTTON);
        BLOCK.append(FORM, OUTPUT);
        document.head.append(STYLE);

        INPUT.addEventListener('input', async function() {
            INPUT.classList.remove('is-valid', 'is-invalid');

        });

        FORM.addEventListener('submit', async e => {
            e.preventDefault();

            OUTPUT.innerHTML = '';

            INPUT.classList.remove('is-valid', 'is-invalid');

            if (checkField(INPUT.value.trim())[0]) {
                getPrototypeChain(OUTPUT, window[checkField(INPUT.value.trim())[1]]);
            }
            else if (INPUT.value.endsWith('.js')) {
                import(`./${INPUT.value}`).then(mod => {
                    getPrototypeChain(OUTPUT, mod.default);
                });
            }
            else {
                INPUT.classList.remove('is-valid');
                INPUT.classList.add('is-invalid');
                alert(`Даного класу ${INPUT.value} в об'єкті window не існує! Спробуйте інший клас`);
                throw Error(`Даного класу ${INPUT.value} в об'єкті window не існує! Спробуйте інший клас`);
            }

        });

        return BLOCK;
    }

    append() {
        this.loadResource('https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
        this.parent.append(this.createElement());
    }
}

function checkField(value) {
    let array = Object.getOwnPropertyNames(window).map(e => {
        if (e.toLowerCase() === value.toLowerCase()) return e;
    }).filter(e => !!e);
    return [array.length, array];
}

function getPrototypeChain(output, val) {
    while (val) {
        if(val.name === '') {
            output.innerHTML += '';
            val = Object.getPrototypeOf(val);
            console.log(val);
        }
        else {
            output.innerHTML += `<li class="list-group-item" style="word-break:break-all"><div class="display-6 pt-2 pb-3 text-center">${val.name?val.name:val.constructor.name}</div>${getPrototypes(val)}</li>`;
            val = Object.getPrototypeOf(val);
        }
    }
}

function getPrototypes(obj) {
    let list = document.createElement('ol');
    for(let item in obj) list.innerHTML += item?`<li class="list-group-item">${typeof item}: ${item}</li>`:'';
    return list.innerHTML?list.outerHTML:'';
}

new PrototypeChain('app').append();