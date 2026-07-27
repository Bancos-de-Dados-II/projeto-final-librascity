import mongoose, {Schema, Document, Model} from 'mongoose';

interface IPessoaSurda extends Document
{
    idUsuario: String;
    idSurdo: String;
    prefereVideoChamada: boolean;
    observacoes: string;
}

const pessoaSurdaSchema = new Schema<IPessoaSurda>(
    {
        idUsuario: {
            type: String,
            required: true,
        },

        idSurdo: {
            type: String,
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