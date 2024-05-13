import express from 'express';
import joi from 'joi'; // validate Schema
import mongoose from 'mongoose'; 
import Project from '../models/project.js';
import { isAuthenticated } from '../middleware/jwt.js'; // middleware auth user

const router = express.Router();

//! GET 
// * Get all projects belonging to the authenticated user
router.get('/projects',isAuthenticated, (req, res, next) => {
    // Check if project ID exists
    Project.find({user: req.payload._id}, { task: 0, __v: 0, updatedAt: 0 })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

//! GET 
//* Get a specific project by its ID
router.get('/project/:id',isAuthenticated, (req, res, next) => {
    /// Define project schema for validation
    if (!req.params.id) return res.status(422).send({ data: { error: true, message: 'Id is required' } });
    Project.find({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id  }).sort({ order: 1 })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

//! POST 
//* Add a new project
router.post('/project', isAuthenticated, (req, res, next) => {
    // Define project schema for validation
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    // Validate request body against schema
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    // Save new project
    new Project({ ...value, user: req.payload._id }).save()
        .then(data => res.status(200).send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } }))
        .catch(error => next(error))
});

//! PUT
//* Update an existing project
router.put('/project/:id', isAuthenticated, (req, res, next) => {
    // Define project schema for validation
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    // Validate request body against schema
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    // Update project
    Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id  }, { $set: value })
        .then(result => res.status(200).send(result))
        .catch(error => next(error))
});

//! DELETE
//* Delete a project
router.delete('/project/:id', isAuthenticated, (req, res, next) => {
    Project.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id  })
        .then(data => res.send(data))
        .catch(error => next(error))
});


//! POST
//* Add a task to a project
router.post('/project/:id/task', isAuthenticated, (req, res, next) => {
    // Check if project ID exists
    if (!req.params.id) return res.status(500).send(`server error`);
    // Define task schema for validation
    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    // Validate request body against schema
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    // Add task to project
    Project.find({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id }, { "task.index": 1 }).sort({ 'task.index': 1 })
        .then(tasks => {
            // Calculate task index and order
            const [{ task }] = tasks;
            let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];
            return Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id },
                { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } });
        })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});


//! GET
//* Get a specific task within a project
router.get('/project/:id/task/:taskId', isAuthenticated, (req, res, next) => {
    // Check if project ID and task ID exist
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    // Find task within project
    Project.find(
        { _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id },
        {
            task: {
                $filter: {
                    input: "$task",
                    as: "task",
                    cond: {
                        $in: [
                            "$$task._id",
                            [
                                new mongoose.Types.ObjectId(req.params.taskId)
                            ]
                        ]
                    }
                }
            }
        })
        .then(data => {
            // Check if task exists
            if (data[0].task.length < 1) return res.status(404).send({ message: 'Record not found' });
            res.send(data);
        })
        .catch(error => next(error));
});

//! PUT
//* Update an existing task within a project
router.put('/project/:id/task/:taskId', isAuthenticated, (req, res, next) => {
    // Check if project ID and task ID exist
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    // Define task schema for validation
    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    // Validate request body against schema
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    // Update task within project
    Project.updateOne({
        _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id,
        task: { $elemMatch: { _id: new mongoose.Types.ObjectId(req.params.taskId) } }
    }, { $set: { "task.$.title": value.title, "task.$.description": value.description } })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

//! DELETE
///* Delete a task from a project
router.delete('/project/:id/task/:taskId', isAuthenticated, (req, res, next) => {
    // Check if project ID and task ID exist
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    // Delete task from project
    Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id), user: req.payload._id },
        { $pull: { task: { _id: new mongoose.Types.ObjectId(req.params.taskId) } } })
        .then(data => res.send(data))
        .catch(error => next(error));
});

//! PUT
//* Update the stages of multiple tasks within a project
router.put('/project/:id/todo', isAuthenticated, async (req, res) => {
    let todo = [];
    // Iterate through request body to update task stages
    for (const key in req.body) {
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name;
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index });
        }
    }
    // Update task stages within project
    await Promise.all(todo.map(async (item) => {
        await Project.updateOne({
            _id: req.params.id, user: req.payload._id,
            "task._id": item.name
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } });
    }));
    res.status(200).send(todo);
});

export default router;