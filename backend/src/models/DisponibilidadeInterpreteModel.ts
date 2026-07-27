import mongoose, {Schema, Document, Model} from 'mongoose';

interface IDisponibilidade extends Document
{
    idDisponibilidade: String;
    idInterprete: String;
    diaSemana: Date;
    horaInicio: Date;
    horaFim: Date;
    ativo: string;
}

const disponibilidadeSchema = new Schema<IDisponibilidade>(
    {
        idDisponibilidade: {
            type: String,
            required: true,
        },
        
        idInterprete: {
            type: String,
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