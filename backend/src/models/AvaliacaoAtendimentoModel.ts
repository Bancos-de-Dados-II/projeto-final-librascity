import mongoose, {Schema, Document, Model} from 'mongoose';

interface IAvaliacaoAtendimento extends Document
{
    idAvaliacao: string;
    estabelecimentoId: string;
    usuarioId?: string;
    nota: number;
    comentario: string;
    dataAvaliacao: Date;
}

const avaliacaoSchema = new Schema<IAvaliacaoAtendimento>(
    {
        idAvaliacao: {
            type: String,
            required: true,
        },

         estabelecimentoId: {
            type: String,
            required: true,
        },

        usuarioId: {
            type: String,
            required: false,
        },

        nota: {
            type: Number,
            required: true,
        },
        
        comentario: {
            type: String,
            required: true,
        },

        dataAvaliacao: {
            type: Date,
            required: true,
        },
    }
)

export const Avaliacao: Model<IAvaliacaoAtendimento> = mongoose.model<IAvaliacaoAtendimento>(
    'AvaliacaoAtendimento',
    avaliacaoSchema
);