const router = require("express").Router();
const { inputValidator } = require("../middlewares/validator");
const {
  newTodo,
  getTodoData,
  getTodoDataById,
  updateTodo,
  deleteTodo,
  AddUserTodo,
} = require("../services/todoService");

router.post(
  "/add-new-todo",
  inputValidator({
    name: "required|string",
    description: "required|string",
  }),
  newTodo
);

router.post(
  "/update-todo",
  inputValidator({
    id: "required|string",
    name: "string",
    description: "string",
    content: "string",
    categories : "string",
    users: "string",
  }),
  updateTodo
);

router.post(
  "/delete-todo",
  inputValidator({ id: "required|string" }),
  deleteTodo
);

router.post(
  "/add-user-todo",
  inputValidator({ id: "required|string", email: "required|email" }),
  AddUserTodo
);

router.get("/todo-all", getTodoData);

router.get("/todo-by-id", getTodoDataById);

module.exports = router;
