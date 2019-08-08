const express = require('express');
const TodoService = require('./todos-service');
const requireAuth = require('../middleware/jwt-auth');

const todoRouter = express.Router();
const jsonBodyParser = express.json();

todoRouter
  .all(requireAuth)
  .route('/newtodo')
  .post(jsonBodyParser, (req, res, next) => {
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

todoRouter
  .all(requireAuth)
  .route('/delete_todo')
  .delete(jsonBodyParser, (req, res, next) => {
    const { todo_id } = req.body;

    TodoService.deleteTodo(req.app.get('db'), todo_id)
      .then(todo => {
        return res.status(202).json(todo);
      })
      .catch(next);
  });

todoRouter
  .all(requireAuth)
  .route('/get_todos')
  .get(jsonBodyParser, (req, res, next) => {
    console.log('REQ.BODY IS: ', req.body);
    const { trip_id } = req.body;
    TodoService.getTodos(req.app.get('db'), trip_id)
      .then(todos => {
        res.status(200).json(todos);
      })
      .catch(next);
  });

module.exports = todoRouter;
