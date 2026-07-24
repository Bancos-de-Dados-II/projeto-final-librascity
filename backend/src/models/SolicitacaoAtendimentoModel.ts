import mongoose, {Schema, Document, Model} from 'mongoose';

interface ISolicitacaoAtendimento extends Document
{
    idSolicitacao: number;
    idSurdo: number;
    idLocal: number;
    tipoAtend: string;
    descricao: string;
    dataAbertura: Date;
    status: string;
    prioridade: string;
}

const solicitacaoAtendimentoSchema = new Schema<ISolicitacaoAtendimento>(
    {
        idSolicitacao: {
            type: Number,
            required: true,
        },

        idSurdo: {
            type: Number,
            required: true,
        },

        idLocal: {
            type: Number,
            required: true,
        },

        tipoAtend: {
            type: String,
            required: true,
        },

        descricao: {
            type: String,
        },

        dataAbertura: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            required: true,
        },

        prioridade: {
            type: String,
            required: true,
        },
    }
)

export const SolicitacaoAtendimento: Model<ISolicitacaoAtendimento> = mongoose.model<ISolicitacaoAtendimento>(
    'SolicitacaoAtendimento',
    solicitacaoAtendimentoSchema
);