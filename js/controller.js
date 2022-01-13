export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.render();

        this.view.bindSelectSort(this.bindSortUsers);
        this.view.bindGetUserDetail(this.bindGetUser);
    }
    render =() => {
        this.model.getData(this.view.displayListUsers, this.view.displayError);
    };

    bindSortUsers = (direction) => {this.view.displayListUsers(this.model.sortUsers(direction))};

    bindGetUser = (id) => {
        this.view.displayUserDetail(this.model.getUserDetail(id), (className) => this.bindCloseUser(className));
    };

    bindCloseUser = (className) => {
        this.view.removeElement(`.${className}`);
        this.view.removeElement(`.${className}-overlay`);
        this.view.bindGetUserDetail(this.bindGetUser);
    };
}

