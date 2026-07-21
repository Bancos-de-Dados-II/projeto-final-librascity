const mongoose = require('mongoose');

const EstabelecimentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    trim: true
  },
  notaMedia: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  fotoUrl: {
    type: String,
    trim: true
  },

  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], 
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 &&
            coords[0] >= -180 && coords[0] <= 180 &&
            coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Coordenadas inválidas'
      }
    }
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

EstabelecimentoSchema.index({ localizacao: '2dsphere' });

module.exports = mongoose.model('Estabelecimento', EstabelecimentoSchema);