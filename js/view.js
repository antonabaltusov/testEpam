export class View {
    constructor() {
        this.app = this.getElement('#root');

        this.userList = this.createElement('ul', ["users__list", "container"]);

        
        this.selectList = this.createElement('select', 'select');

        this.optionDefault = this.createElement('option', 'option');
        this.optionDefault.text = 'sort';
        this.optionDefault.hidden = true;

        this.optionSort = this.createElement('option', 'option');
        this.optionSort.value = '1';
        this.optionSort.id = 'sort-users';
        this.optionSort.selected = false;
        this.optionSort.text = `from A to Z`;

        this.optionRevers = this.createElement('option', 'option');
        this.optionRevers.value = '';
        this.optionRevers.id = 'sort-users';
        this.optionRevers.selected = false;
        this.optionRevers.text = 'from Z to A';

        this.selectList.append(this.optionDefault, this.optionSort, this.optionRevers);

        this.app.append(this.selectList, this.userList);
    }
    displayError = (err) => {
        this.app.append(err)
    };

    createElement = (tag, className) => {
        const element = document.createElement(tag);
        if (className) {
            if(className instanceof Array) {
                element.classList.add(...className);
            } else element.classList.add(className);
        };
        return element;
    };

    getElement = (selector) => {
        const element = document.querySelector(selector);
        return element;
    };

    removeElement = (selector) => {
        const element = this.getElement(selector);
        element.remove();
    };

    displayListUsers = (users) => {
        while (this.userList.firstChild) {
            this.userList.removeChild(this.userList.firstChild)
        }
            
        if (users.length === 0) {
            const p = this.createElement('p');
            p.textContent = 'the list is empty';
            this.userList.append(p);
        } else {
            users.forEach((user, id) => {
                const li = this.createElement('li', 'users__item');
                li.id = id;
                
                const img = this.createElement('img', 'users__item-img');
                img.setAttribute('src', user.picture);
                img.setAttribute('alt', 'photo');

                const name = this.createElement('p', 'users__item-name');
                name.textContent = `${user.name.title}. ${user.name.first} ${user.name.last}`;

                li.append(img, name);
            
                this.userList.append(li);
            })
        };
    };

    displayUserDetail = (user, handler) => {
        const userDetail = this.createElement('div', 'user_detail');

        const userDetailBox = this.createElement('div', 'user_detail-box');

        const closeButton = this.createElement('button', 'user_detail-close');
        closeButton.textContent = 'close';
        this.bindCloseUserDetail(handler, closeButton);

        const img = this.createElement('img', 'user_detail-img');
        img.setAttribute('src', user.picture);
        img.setAttribute('alt', 'photo');

        const info = this.createElement('div', 'user_detail-info');

        const name = this.createElement('p', 'user_detail-text');
        name.textContent = `${user.name.title}. ${user.name.first} ${user.name.last}`;

        const street = this.createElement('p', 'user_detail-text');
        street.textContent = `street: ${user.location.street}`;

        const city = this.createElement('p', 'user_detail-text');
        city.textContent = `city: ${user.location.city}`;

        const state = this.createElement('p', 'user_detail-text');
        state.textContent = `state: ${user.location.state}`;

        const email = this.createElement('p', 'user_detail-text');
        email.textContent = `email: ${user.email}`;

        const phone = this.createElement('p', 'user_detail-text');
        phone.textContent = `phone: ${user.phone}`;

        info.append(name, street, city, state, email, phone);
        userDetailBox.append(img, info, closeButton);
        userDetail.append(userDetailBox);

        const overlay = this.createElement('dis', 'user_detail-overlay')

        this.app.append(userDetail, overlay);
    };

    bindSelectSort = (handler) => {
        this.selectList.addEventListener('change', () => {handler(this.selectList.value)});
    };

    bindGetUserDetail = (handler) => {
        this.userList.addEventListener('click', event => {
            const id = parseInt(event.target.parentElement.id);
            if (id || id === 0) {
                handler(id);
            } else {
                this.bindGetUserDetail(handler);
            }
        }, {once:true});
    };

    bindCloseUserDetail = (handler, element) => {
        element.addEventListener('click', event => {
          if (event.target.className === 'user_detail-close') {
            handler(event.target.parentElement.parentElement.className)
          }
        }, {once:true});
    };
}