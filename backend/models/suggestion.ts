import mongoose, { Document, Schema } from 'mongoose';

export interface Suggestion extends Document {
    codeSnippet: string;
    suggestion: string;
    createdAt: Date;
}

const SuggestionSchema: Schema = new Schema({
    codeSnippet: { type: String, required: true },
    suggestion: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<Suggestion>('Suggestion', SuggestionSchema);
