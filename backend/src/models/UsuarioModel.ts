import mongoose, {Schema, Document, Model} from 'mongoose';

interface IUsuario extends Document
{
    id: number;
    nome: string;
    email: string;
    senha: string;
    fotoPerfilUrl: string;
    telefone: Number;
    tipoUsuario: string;
    dataCadast: Date;
    status: string;
}

const UsuarioSchema = new Schema<IUsuario>(
    {
        id: {
            type: Number,
            required: true,
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
            type: Number,
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
        }
    },
);

export const Usuario: Model<IUsuario> = mongoose.model<IUsuario>(
    'Usuario',
    UsuarioSchema
);