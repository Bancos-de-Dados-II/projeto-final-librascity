import mongoose, {Schema, Document, Model} from 'mongoose';

interface IUsuario extends Document
{
    id: string;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    tipoUsuario: string;
    status: string;
    fotoPerfilUrl: string;
    latitude?: number;
    longitude?: number;
    dataAtualizacaoLocalizacao?: Date;
    dataCadast: Date;
}

const UsuarioSchema = new Schema<IUsuario>(
    {
        id: {
            type: String,
        },

        nome: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        
        senha: {
        type: String,
        required: true
        },

        telefone: {
            type: String,
            required: true,
        },

        tipoUsuario: {
            type: String,
            required: true,
        },

        fotoPerfilUrl: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            required: true,
            trim: true,
        },

        latitude: {
            type: Number,
        },

        longitude: {
            type: Number,
        },

        dataAtualizacaoLocalizacao: {
            type: Date,
        },

        dataCadast: {
            type: Date,
            default: Date.now(),
        }
    },
);

export const Usuario: Model<IUsuario> = mongoose.model<IUsuario>(
    'Usuario',
    UsuarioSchema
);