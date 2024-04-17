import { Schema, model } from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    description: String,
    task: [
        {
            id: Number,
            title: String,
            description: String,
            order: Number,
            stage: String,
            index: Number,
            attachment: [
                { type: String, url: String }
            ],
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
        }
    ]
},
{ timestamps: true }
);

const Project = model('project', projectSchema);

export default Project;