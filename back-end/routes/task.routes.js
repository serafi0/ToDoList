module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js');

    // Create a new Note
    app.post('/tasks', tasks.create);
    app.delete('/clear', tasks.deleteAll);


    //make done or uncheck
    // app.post('/counter/main',tasks.create_first_counter)
    app.get('/counter',tasks.findcounter)
    app.put('/tasks/toggleDone/:taskId', tasks.makeTaskDoneOrUncheck)

    // Retrieve all Notes
    app.get('/tasks', tasks.findAll);

    // Retrieve a single Note with noteId
    app.get('/tasks/:taskId', tasks.findOne);

    // Update a Note with noteId
    app.put('/tasks/:taskId', tasks.update);

    // Delete a Note with noteId
    app.delete('/tasks/:taskId', tasks.delete);
}
