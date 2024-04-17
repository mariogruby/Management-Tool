import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import Project from '../models/index.js';

const router = express.Router()

//* get projects
router.get('/projects', (req, res, next) => {
    Project.find({}, { task: 0, __v: 0, updatedAt: 0 })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

//* get project by id
router.get('/project/:id', (req, res, next) => {
    if (!req.params.id) return res.status(422).send({ data: { error: true, message: 'Id is required' } });
    Project.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).sort({ order: 1 })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

//* add project
router.post('/project', (req, res, next) => {
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    new Project(value).save()
        .then(data => res.status(200).send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } }))
        .catch(error => next(error))
});

//* edit project 
router.put('/project/:id', (req, res, next) => {
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, { $set: value })
        .then(result => res.status(200).send(result))
        .catch(error => next(error))
});

//* delete project
router.delete('/project/:id', (req, res, next) => {
    Project.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
        .then(data => res.send(data))
        .catch(error => next(error))
});

//* add task
router.post('/project/:id/task', (req, res, next) => {
    if (!req.params.id) return res.status(500).send(`server error`);
    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    Project.find({ _id: new mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 }).sort({ 'task.index': 1 })
        .then(tasks => {
            const [{ task }] = tasks;
            let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];
            return Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) },
                { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } });
        })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
})

router.get('/project/:id/task/:taskId', (req, res, next) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    Project.find(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
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
            if (data[0].task.length < 1) return res.status(404).send({ message: 'Record not found' });
            res.send(data);
        })
        .catch(error => next(error));
});

//* edit task
router.put('/project/:id/task/:taskId', (req, res, next) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    Project.updateOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
        task: { $elemMatch: { _id: new mongoose.Types.ObjectId(req.params.taskId) } }
    }, { $set: { "task.$.title": value.title, "task.$.description": value.description } })
        .then(data => res.status(200).send(data))
        .catch(error => next(error));
});

///* delete task 
router.delete('/project/:id/task/:taskId', (req, res, next) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    Project.updateOne({ _id: new mongoose.Types.ObjectId(req.params.id) },
        { $pull: { task: { _id: new mongoose.Types.ObjectId(req.params.taskId) } } })
        .then(data => res.send(data))
        .catch(error => next(error));
})

//* edit ToDo
router.put('/project/:id/todo', async (req, res) => {
    let todo = []

    for (const key in req.body) {
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index })
        }
    }
    todo.map(async (item) => {
        await Project.updateOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: new mongoose.Types.ObjectId(item.name) } }
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } })
    })
    res.status(200).send(todo)
})

export default router