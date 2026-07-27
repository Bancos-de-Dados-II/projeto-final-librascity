import mongoose, {Schema, Document, Model} from 'mongoose';

interface ILocalizacao extends Document
{
    idLocal: string;
    latitude: number;
    longitude: number;
    dataAtualizada: Date;
}

const localizacaoSchema = new Schema<ILocalizacao>(
    {
        idLocal: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        dataAtualizada: {
            type: Date,
            default: Date.now,
        },
    }
)

export const Localizacao: Model<ILocalizacao> = mongoose.model<ILocalizacao>(
    'Localizacao',
    localizacaoSchema
);