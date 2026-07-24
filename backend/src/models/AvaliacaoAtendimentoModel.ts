import mongoose, {Schema, Document, Model} from 'mongoose';

interface IAvaliacaoAtendimento extends Document
{
    idAvaliacao: number;
    idAtendimento: number;
    nota: number;
    comentario: string;
    dataAvaliacao: Date;
}

const avaliacaoSchema = new Schema<IAvaliacaoAtendimento>(
    {
        idAvaliacao: {
            type: Number,
            required: true,
        },

        idAtendimento: {
            type: Number,
            required: true,
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