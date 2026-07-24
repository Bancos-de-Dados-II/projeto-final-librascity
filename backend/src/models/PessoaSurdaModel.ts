import mongoose, {Schema, Document, Model} from 'mongoose';

interface IPessoaSurda extends Document
{
    idUsuario: number;
    idSurdo: number;
    prefereVideoChamada: boolean;
    observacoes: string;
}

const pessoaSurdaSchema = new Schema<IPessoaSurda>(
    {
        idUsuario: {
            type: Number,
            required: true,
        },

        idSurdo: {
            type: Number,
            required: true,
        },

        prefereVideoChamada: {
            type: Boolean,
            required: true,
        },

        observacoes: {
            type: String,
            required: true,
        }
    },
);

export const PessoaSurda: Model<IPessoaSurda> = mongoose.model<IPessoaSurda>(
    'PessoaSurda',
    pessoaSurdaSchema
);