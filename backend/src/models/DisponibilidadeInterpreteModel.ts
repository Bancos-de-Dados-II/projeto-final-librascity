import mongoose, {Schema, Document, Model} from 'mongoose';

interface IDisponibilidade extends Document
{
    idDisponibilidade: number;
    idInterprete: number;
    diaSemana: Date;
    horaInicio: Date;
    horaFim: Date;
    ativo: string;
}

const disponibilidadeSchema = new Schema<IDisponibilidade>(
    {
        idDisponibilidade: {
            type: Number,
            required: true,
        },
        
        idInterprete: {
            type: Number,
            required: true,
        },

        diaSemana: {
            type: Date,
            required: true,
        },

        horaInicio: {
            type: Date,
            required: true,
        },

        horaFim: {
            type: Date,
            required: true,
        },

        ativo: {
            type: String,
            required: true,
        },
    }
)

export const Disponibilidade: Model<IDisponibilidade> = mongoose.model<IDisponibilidade>(
    'Disponibilidade',
    disponibilidadeSchema
);