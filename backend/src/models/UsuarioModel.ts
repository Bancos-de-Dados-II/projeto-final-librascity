import mongoose, {Schema, Document, Model} from 'mongoose';

interface IUsuario extends Document
{
    id: string;
    nome: string;
    email: string;
    senha: string;
    fotoPerfilUrl: string;
    telefone: string;
    tipoUsuario: string;
    dataCadast: Date;
    status: string;
    latitude?: number;
    longitude?: number;
    dataAtualizacaoLocalizacao?: Date;
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

        fotoPerfilUrl: {
            type: String,
            trim: true,
        },

        telefone: {
            type: String,
            required: true,
        },

        tipoUsuario: {
            type: String,
            required: true,
        },

        dataCadast: {
            type: Date,
            default: Date.now(),
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
        }
    },
);

export const Usuario: Model<IUsuario> = mongoose.model<IUsuario>(
    'Usuario',
    UsuarioSchema
);