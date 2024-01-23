const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Types: { ObjectId } } = mongoose;

const app = express();

const Muesfitt = require('./models/muesfitt');
const YourModel = require('./models/muesfitt');

const dbURL = 'mongodb+srv://muhammed:5bhh2cv2@klnk.0vkppng.mongodb.net/MUESFITT?retryWrites=true&w=majority';

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('MongoDB bağlantısı başarıyla kuruldu'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kalori.html'));
});

app.get('/anasayfa', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'anasayfa.html'));
});

app.get('/indeks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indeks.html'));
});

app.post('/index.html', (req, res) => {
  const formData = req.body;

  YourModel.create(formData)
    .then(data => {
      console.log('MongoDB\'ye veri eklendi:', data);
      res.json(data);
    })
    .catch(error => {
      console.error('MongoDB\'ye veri eklerken hata:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    });
});

app.delete('/all/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    Muesfitt.deleteOne({ _id: ObjectId(req.params.id) })
      .then(sonuc => {
        res.status(200).json(sonuc);
      })
      .catch(err => {
        res.status(500).json({ hata: 'veri silinemedi' });
      });
  } else {
    res.status(500).json({ hata: 'ID geçerli değil' });
  }
});

app.get('/all', (req, res) => {
  Muesfitt.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error('MongoDB\'den veri çekerken hata oluştu:', err);
      res.status(500).send('Internal Server Error');
    });
});

app.put('/all/:id', (req, res) => {
  const guncellenecekveri = req.body;

  if (ObjectId.isValid(req.params.id)) {
    Muesfitt.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: guncellenecekveri }
    )
      .then(sonuc => {
        res.status(200).json(sonuc);
      })
      .catch(err => {
        res.status(500).json({ hata: 'Veri güncellenmedi' });
      });
  } else {
    res.status(500).json({ hata: 'Veri geçerli değil' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Uygulama ${PORT} portunda dinleniyor.`);
});
