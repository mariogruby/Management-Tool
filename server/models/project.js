import { Schema, model } from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
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

const Project = model('Project', projectSchema);

export default Project;
