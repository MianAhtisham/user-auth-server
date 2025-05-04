import express from "express";
import { addTodo, getTodos, deleteTodo } from "../controller/todoController.js";

const route = express.Router();

route.post("/todo", addTodo);
route.get("/todos", getTodos);
route.delete("/todo/:id", deleteTodo);

export default route;
