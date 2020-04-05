const Task = require('../models/task.models.js');
const global_counter = require('../models/counter.models')
// Create and Save a new Note

// Create and Save a new counter
// exports.create_first_counter =(req, res) => {
    

//base for counter
//     const task = new global_counter({
//         _id :'mainCounter',
//         num:0
//     });
//     // Save task in the database
//     task.save()
//     .then(data => {
//         res.send(data);
//             res.send({message:'you can add any more tasks'});
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "Some error occurred while creating the Note."
//         });
//     });

// };

 function editCounterBy(NumberForCounter){
    global_counter.findByIdAndUpdate("mainCounter", {$inc:{num:NumberForCounter}
}, {new: true})
.then(task => {
    if(!task) {
        return res.status(404).send({
            message: "Note not found with id " + req.params.taskId
        });
    }
    // res.send(task);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "task not found with id " + req.params.taskId
        });                
    }
    return res.status(500).send({
        message: "Error updating task with id " + req.params.taskId
    });
});
 }

exports.findcounter = (req, res) => {
    global_counter.findById("mainCounter")
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Note not found with id" 
            });            
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id" 
            });                
        }
        return res.status(500).send({
            message: "Error retrieving task with id" 
        });
    });
};



exports.deleteAll = (req,res)=>{

    Task.deleteMany({})
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.taskId
            });
        }
        res.send({message: "tasks were cleared successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.taskId
        });
    });

    //reset counter too
    global_counter.findByIdAndUpdate("mainCounter",{num:0}).then(task => {
        if(!counter) {
            return res.status(404).send({
                message: "Note not found with counter" 
            });
        };

})
}
// Create and Save a new Note
exports.create = (req, res) => {
    
    // Validate request
    if(!req.body.discription) {
        return res.status(400).send({
            message: "the discription can not be empty"
        });
    }



    // Create a task


    const task = new Task({
        content: req.body.content || "Untitled Task", 
        discription: req.body.discription,
        done: req.body.done,
        _id : req.body.count,
        // counter:
        
    });
    // Save task in the database
    task.save()
    .then(data => {
        editCounterBy(1);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the task."
        });
    });

    
};
exports.findAll = (req, res) => {
    Task.find()
    .then(tasks => {
        res.send(tasks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tasks."
        });
    });
};

exports.findOne = (req, res) => {
    Task.findById(req.params.taskId)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });            
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving task with id " + req.params.taskId
        });
    });
};


// Update a note identified by the noteId in the request
// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.discription) {
        return res.status(400).send({
            message: "task details content can not be empty"
        });
    }

    // Find note and update it with the request body
    Task.findByIdAndUpdate(req.params.taskId, {
        content: req.body.content || "Untitled task",
        discription: req.body.discription,
        _id:req.body.count,
        done:req.body.done
    }, {new: true})
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Error updating task with id " + req.params.taskId
        });
    });
};


exports.makeTaskDoneOrUncheck=(req,res)=>{

    if(req.body.done === false){
        req.body.done=true;
    }else{
        req.body.done = false;
    }
    Task.findByIdAndUpdate(req.params.taskId, {
        done:req.body.done
    }, {new: true})
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Error updating task with id " + req.params.taskId
        });
    });

}



// Delete a note with the specified noteId in the request
// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Task.findByIdAndRemove(req.params.taskId)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.taskId
            });
        }
        res.send({message: "task deleted successfully!"});
        editCounterBy(-1)
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.taskId
        });
    });
};