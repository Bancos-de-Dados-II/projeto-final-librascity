import mongoose, {Schema, Document, Model} from 'mongoose';

interface IVonluntario extends Document
{
    idUsuario: number;
    idInterprete: number;
    experiencia: string;
    disponibilidade: string;
}

const vonluntarioSchema = new Schema<IVonluntario>(
    {
        idUsuario: {
            type: Number,
            required: true,
        },

        idInterprete: {
            type: Number,
            required: true,
        },

        experiencia: {
            type: String,
            required: true,
        },

        disponibilidade: {
            type: String,
            required: true,
        }
    },
);

export const Vonluntario: Model<IVonluntario> = mongoose.model<IVonluntario>(
    'Vonluntario',
    vonluntarioSchema
);