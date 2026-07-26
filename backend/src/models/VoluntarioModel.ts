import mongoose, {Schema, Document, Model} from 'mongoose';

interface IVonluntario extends Document
{
    idUsuario: string;
    idInterprete: number;
    experiencia: string;
    disponibilidade: string;
    statusOnline: boolean;

}

const vonluntarioSchema = new Schema<IVonluntario>(
    {
        idUsuario: {
            type: String,
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
        },
        
        statusOnline: {
            type: Boolean,
            default: false,
        },

    },
);

export const Vonluntario: Model<IVonluntario> = mongoose.model<IVonluntario>(
    'Vonluntario',
    vonluntarioSchema
);