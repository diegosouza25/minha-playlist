const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const musicasPath = path.join(__dirname, "musicas.json");

app.get("/api/musicas", (req, res) => {
  fs.readFile(musicasPath, "utf-8", (err, data) => {
    if(err) return res.status(500).json({error:"Erro ao ler arquivo."});
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/api/musicas", (req,res) => {
  const nova = req.body;
  if(!nova.titulo || !nova.autor) return res.status(400).json({error:"Título e autor obrigatórios."});
  fs.readFile(musicasPath, "utf-8", (err,data)=>{
    if(err) return res.status(500).json({error:"Erro ao ler arquivo."});
    const musicas = JSON.parse(data || "[]");
    musicas.push(nova);
    fs.writeFile(musicasPath, JSON.stringify(musicas,null,2),(err)=>{
      if(err) return res.status(500).json({error:"Erro ao salvar música."});
      res.json({success:true});
    });
  });
});

app.listen(PORT,()=>console.log(`Servidor rodando em http://localhost:${PORT}`));
