export class Model {
    constructor(url) {
        this.users;
        this.url = url;
    }

    getData = (callback, onErr, functionGetListUsers = this.getListUsers) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.url);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = () => {
            if (xhr.status != 200) {
                onErr(`Ошибка ${xhr.status}: ${xhr.statusText}`); 
            } else {
                const results = xhr.response.results;
                this.users = results;
                callback(functionGetListUsers(results));
            }
        };
    };

    getUserDetail = (id) => {
        const user = this.users[id];
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
    };

    getListUsers = (users) => {
        const list = [];
        users.forEach((user) => {
            let userItem = {
                picture: user.picture.medium,
                name: user.name
            };
            list.push(userItem);
        })
        return list;
    };

    sortUsers = (direction) => {
        this.users.sort (function(a, b) {
            const nameA = a.name.first.toLowerCase(), nameB = b.name.first.toLowerCase();
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
            };
        });
        return this.getListUsers(this.users);
    };
}