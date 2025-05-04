import Todo from "../model/todoModel.js";

export const addTodo = async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: "Task is required" });
    }

    const newTodo = new Todo({
      user: req.session.userId,
      task,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.session.userId });
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};
