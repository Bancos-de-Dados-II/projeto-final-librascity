import mongoose, {Schema, Document, Model} from 'mongoose';

interface IVoluntario extends Document
{
    idUsuario: string;
    idInterprete: string;
    experiencia: string;
    disponibilidade: string;
    statusOnline: boolean;

}

const voluntarioSchema = new Schema<IVoluntario>(
    {
        idUsuario: {
            type: String,
            required: true,
        },

        idInterprete: {
            type: String,
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

export const Voluntario: Model<IVoluntario> = mongoose.model<IVoluntario>(
    'Voluntario',
    voluntarioSchema
);