import mongoose, {Schema, Document, Model} from 'mongoose';

interface IAtendimento extends Document
{
    idAtendimento: String;
    idSolicitacao: String;
    idInterprete: String;
    dataInicio: Date;
    dataFim: Date;
    modalidade: string,
}

const atendimentoSchema = new Schema<IAtendimento>(
    {
        idAtendimento: {
            type: String,
            required: true,
        },

        idSolicitacao: {
            type: String,
            required: true,
        },

        idInterprete: {
            type: String,
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