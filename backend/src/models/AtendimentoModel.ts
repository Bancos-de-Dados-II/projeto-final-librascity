import mongoose, {Schema, Document, Model} from 'mongoose';

interface IAtendimento extends Document
{
    idAtendimento: number;
    idSolicitacao: number;
    idInterprete: number;
    dataInicio: Date;
    dataFim: Date;
    modalidade: string,
}

const atendimentoSchema = new Schema<IAtendimento>(
    {
        idAtendimento: {
            type: Number,
            required: true,
        },

        idSolicitacao: {
            type: Number,
            required: true,
        },

        idInterprete: {
            type: Number,
            required: true,
        },

        dataInicio: {
            type: Date,
            default: Date.now,
        },

        dataFim: {
            type: Date,
        },

        modalidade: {
            type: String,
            required: true,
        },
    }
)

export const Atendimento: Model<IAtendimento> = mongoose.model<IAtendimento>(
    'Atendimento',
    atendimentoSchema
);