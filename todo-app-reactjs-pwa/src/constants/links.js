/* eslint-disable import/no-anonymous-default-export */
import appConfig from "../appConfig";
const baseUri = appConfig.domain_api;

export default {
  baseUri,
  update: baseUri + "/app/update-todo",
  delete: baseUri + "/app/delete-todo",
  addUserTodo : baseUri + "/app/add-user-todo",
  login: baseUri + "/auth/login",
  register: baseUri + "/auth/register",
  getUserByToken: baseUri + "/auth/get-user-by-token",
  addNewTodo: baseUri + "/app/add-new-todo",
  todoAll : baseUri + "/app/todo-all",
  todoById : baseUri + "/app/todo-by-id",
  logout: baseUri + "/logout",
};
