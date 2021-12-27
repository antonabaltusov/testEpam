import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';

const app = new Controller(new Model('https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture'), new View());
 