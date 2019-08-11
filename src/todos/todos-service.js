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
      .where({ trip_id })
      .orderBy('id', 'asc');
  },
  updateTodo(db, { id, title, done_status }) {
    return db('todo_items')
      .where({ id })
      .update({ title, done_status });
  }
};

module.exports = TodoService;
