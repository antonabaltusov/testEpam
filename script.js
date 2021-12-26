class Model {
    constructor() {
        this.users;
    }

    getData = (callback, functionGetListUsers = this.getListUsers) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture');
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = () => {
            if (xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); 
              } else {
                let results = xhr.response.results;
                this.users = results;
                callback(functionGetListUsers(results));
              }
        };
    }

    getUserDetail = (id) => {
        let user = this.users[id];
        return {
            picture: user.picture.large,
            name: user.name,
            location: {
                street: user.location.street,
                city: user.location.city,
                state: user.location.state,
            },
            email: user.email,
            phone: user.phone
        }
    }

    getListUsers = (users) => {
        let list = [];
        users.forEach((user) => {
            let userItem = {
                picture: user.picture.medium,
                name: user.name
            };
            list.push(userItem);
        })
        return list;
    }

    sortUsers = (direction) => {
        this.users.sort(function(a, b){
            var nameA=a.name.first.toLowerCase(), nameB=b.name.first.toLowerCase();
            if (direction) {
                if (nameA < nameB)
                return -1
                if (nameA > nameB)
                return 1
                return 0
            } else {
                if (nameA > nameB)
                return -1
                if (nameA < nameB)
                return 1
                return 0
            }
        });
        return this.getListUsers(this.users);
    }
}
 
class View {
    constructor() {
        this.app = this.getElement('#root');

        this.userList = this.createElement('ul', ["users__list", "container"]);

        
        this.selectList = this.createElement('select');

        this.optionDefault = this.createElement('option');
        this.optionDefault.text = 'sort';
        this.optionDefault.hidden = true;

        this.optionSort = this.createElement('option');
        this.optionSort.value = '1';
        this.optionSort.id = 'sort-users';
        this.optionSort.selected = false;
        this.optionSort.text = `from A to Z`;

        this.optionRevers = this.createElement('option');
        this.optionRevers.value = '';
        this.optionRevers.id = 'sort-users';
        this.optionRevers.selected = false;
        this.optionRevers.text = 'from Z to A';

        this.selectList.append(this.optionDefault, this.optionSort, this.optionRevers);

        this.app.append(this.selectList, this.userList);
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) {
            if(className instanceof Array) {
                element.classList.add(...className);
            } else element.classList.add(className);
        };
        return element;
    }

    getElement(selector) {
        const element = document.querySelector(selector);
        return element;
    }

    removeElement(selector) {
        const element = this.getElement(selector);
        element.remove();
    }

    displayListUsers(users) {
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
        }
    }

    displayUserDetail(user) {
        const userDetail = this.createElement('div', 'user_detail');

        const closeButton = this.createElement('button', 'close');
        closeButton.textContent = 'close';

        const img = this.createElement('img', 'img-medium');
        img.setAttribute('src', user.picture);
        img.setAttribute('alt', 'photo');

        const name = this.createElement('p');
        name.textContent = `${user.name.title}. ${user.name.first} ${user.name.last}`;

        const street = this.createElement('p');
        street.textContent = `street: ${user.location.street}`;

        const city = this.createElement('p');
        city.textContent = `city: ${user.location.city}`;

        const state = this.createElement('p');
        state.textContent = `state: ${user.location.state}`;

        const email = this.createElement('p');
        email.textContent = `email: ${user.email}`;

        const phone = this.createElement('p');
        phone.textContent = `phone: ${user.phone}`;

        userDetail.append(img, name, street, city, state, email, phone, closeButton);

        const overlay = this.createElement('dis', 'user_detail-overlay')

        this.app.append(userDetail, overlay);
    }

    bindSelectSort(handler) {
        this.selectList.addEventListener('change', () => {handler(this.selectList.value)});
    }

    bindGetUserDetail(handler) {
        this.userList.addEventListener('click', event => {
            const id = parseInt(event.target.parentElement.id);
            handler(id);
            
        }, {once:true});
    }

    bindCloseUserDetail(handler) {
        this.app.addEventListener('click', event => {
          if (event.target.className === 'close') {
            handler(event.target.parentElement.className)
          }
        });
    }
}
  
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.render();

        this.view.bindSelectSort((direction) => this.bindSortUsers(direction));
        this.view.bindGetUserDetail((id) => this.bindGetUser(id));
    }
    render() {
        this.model.getData((data) => {this.view.displayListUsers(data)});
    }

    bindSortUsers(direction) {this.view.displayListUsers(this.model.sortUsers(direction))}

    bindGetUser(id) {
        this.view.displayUserDetail(this.model.getUserDetail(id));
        this.view.bindCloseUserDetail((className) => this.bindCloseUser(className));
    }

    bindCloseUser(className) {
        this.view.removeElement(`.${className}`);
        this.view.removeElement(`.${className}-overlay`);
        this.view.bindGetUserDetail((id) => this.bindGetUser(id));
    }

}
  
  const app = new Controller(new Model(), new View());
 