const xss = require('xss');

const TodoService = {
  serializeTodo(todo) {
    return {
      user_id: todo.user_id,
      trip_id: todo.trip_id,
      title: xss(todo.title),
      user_name: xss(todo.user_name)
    };
  },
  insertTodo(db, newTodo) {
    return db('todo_items')
      .insert(newTodo)
      .where('user_name', newTodo.user_name)
      .where('trip_id', newTodo.trip_id)
      .returning('*')
      .then(([todo]) => todo);
  },
  deleteTodo(db, todo_id) {
    return db('todo_items')
      .where('id', todo_id)
      .delete();
  },
  getTodos(db, trip_id) {
    return db('todo_items')
      .select('*')
      .where({ trip_id });
  },
  updateTodo(db, data) {
    return db('todo_items')
      .where('title', data.title)
      .where('user_id', data.user_id)
      .update(`${data.update}`, data.update);
  }
};

module.exports = TodoService;
