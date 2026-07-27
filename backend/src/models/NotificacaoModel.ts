import mongoose, {Schema, Document, Model} from 'mongoose';

interface INotificacao extends Document
{
    idNotificao: number;
    idUsuario: string;
    idRemetente?: string;
    titulo: string;
    mensagem: string;
    tipo: string;
    lida: boolean;
    dataEnvio: Date;
}

const notificacaoSchema = new Schema<INotificacao>(
    {
        idNotificao: {
            type: Number,
            required: true,
        },

        idUsuario: {
            type: String,
            required: true,
        },

        idRemetente: {
            type: String,
            required: false,
        },

        titulo: {
            type: String,
            required: true,
        },

        mensagem: {
            type: String,
            required: true,
        },

        tipo: {
            type: String,
            required: true,
        },

        lida: {
            type: Boolean,
            required: true,
        },

        dataEnvio: {
            type: Date,
            required: true,
        },
    }
)

export const Notificacao: Model<INotificacao> = mongoose.model<INotificacao>(
    'Notificacao',
    notificacaoSchema
);