import mongoose, {Schema, Document, Model} from 'mongoose';

export type StatusChamado = 'AGUARDANDO' | 'EM_CURSO' | 'FINALIZADA' | 'CANCELADA';

interface ISolicitacaoAtendimento extends Document
{
    idSolicitacao: number;
    idSurdo: string;
    idInterprete?:string;
    idLocal?:number;
    tipoAtend: string;
    descricao: string;
    dataAbertura: Date;
    status: string;
    prioridade: string;
    latitudeAtual?: number;
    longitudeAtual?: number;
    fotoContextoUrl?: string;
    dataHoraAceite?: Date;
    dataHoraFim?: Date;

}

const solicitacaoAtendimentoSchema = new Schema<ISolicitacaoAtendimento>(
    {
        idSolicitacao: {
            type: Number,
            required: true,
        },

        idSurdo: {
            type: String,
            required: true,
        },

        idInterprete: {
            type: String,
        },

        idLocal: {
            type: Number,
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
            enum: ['AGUARDANDO', 'EM_CURSO', 'FINALIZADA', 'CANCELADA'],

        },

        prioridade: {
            type: String,
            required: true,
        },

        latitudeAtual: {
            type: Number,
        },

        longitudeAtual: {
            type: Number,
        },

        fotoContextoUrl: {
            type: String,
        },

        dataHoraAceite: {
            type: Date,
        },

        dataHoraFim: {
            type: Date,
        },

    }
)

export const SolicitacaoAtendimento: Model<ISolicitacaoAtendimento> = mongoose.model<ISolicitacaoAtendimento>(
    'SolicitacaoAtendimento',
    solicitacaoAtendimentoSchema
);