export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.render();

        this.view.bindSelectSort((direction) => this.bindSortUsers(direction));
        this.view.bindGetUserDetail((id) => this.bindGetUser(id));
    }
    render =() => {
        this.model.getData((data) => {this.view.displayListUsers(data)}, (err) => {this.view.displayError(err)});
    };

    bindSortUsers = (direction) => {this.view.displayListUsers(this.model.sortUsers(direction))};

    bindGetUser = (id) => {
        this.view.displayUserDetail(this.model.getUserDetail(id), (className) => this.bindCloseUser(className));
    };

    bindCloseUser = (className) => {
        this.view.removeElement(`.${className}`);
        this.view.removeElement(`.${className}-overlay`);
        this.view.bindGetUserDetail((id) => this.bindGetUser(id));
    };
}

