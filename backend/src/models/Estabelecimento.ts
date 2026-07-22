import mongoose, { Schema, Document, Model } from 'mongoose';

interface IEstabelecimento extends Document {
  nome: string;
  categoria?: string;
  notaMedia?: number;
  fotoUrl?: string;
  localizacao: {
    type: 'Point';
    coordinates: [number, number];
  };
  criadoEm: Date;
}

const EstabelecimentoSchema = new Schema<IEstabelecimento>(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
    },
    notaMedia: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    fotoUrl: {
      type: String,
      trim: true,
    },
    localizacao: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords: number[]) => {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Coordenadas inválidas',
        },
      },
    },
    criadoEm: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

EstabelecimentoSchema.index({ localizacao: '2dsphere' });

export const Estabelecimento: Model<IEstabelecimento> = mongoose.model<IEstabelecimento>(
  'Estabelecimento',
  EstabelecimentoSchema
);