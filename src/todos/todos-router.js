const express = require('express');
const TodoService = require('./todos-service');
const requireAuth = require('../middleware/requireAuth');
const todosRouter = express.Router();
const jsonBodyParser = express.json();

todosRouter
  .route('/new_todo')
  .post(jsonBodyParser, requireAuth, (req, res, next) => {
    const { user_name, trip_id, title, done_status } = req.body;

    const newTodo = {
      user_name,
      trip_id,
      title,
      done_status
    };

    for (const [key, value] of Object.entries(newTodo)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    TodoService.insertTodo(req.app.get('db'), newTodo)
      .then(todo => {
        return res.status(204).json(todo);
      })
      .catch(next);
  });

todosRouter
  .route('/delete_todo')
  .delete(jsonBodyParser, requireAuth, (req, res, next) => {
    const { todo_id } = req.body;

    TodoService.deleteTodo(req.app.get('db'), todo_id)
      .then(todo => {
        return res.status(202).json(todo);
      })
      .catch(next);
  });

todosRouter
  .route('/get_todos/:trip_id')
  .get(jsonBodyParser, requireAuth, (req, res, next) => {
    const { trip_id } = req.params;
    console.log(trip_id);
    TodoService.getTodos(req.app.get('db'), trip_id)
      .then(todosList => {
        return res.status(200).json(todosList);
      })
      .catch(next);
  });

todosRouter
  .route('/update_todo')
  .put(jsonBodyParser, requireAuth, (req, res, next) => {
    const { id, title, done_status } = req.body;

    const data = {
      id,
      title,
      done_status
    };

    TodoService.updateTodo(req.app.get('db'), data)
      .then(todo => {
        return res.status(204).json(todo);
      })
      .catch(next);
  });

module.exports = todosRouter;
