const express = require("express");
const cors = require('cors');
const os = require('os');
const app = express();
const port = 8080;

app.use(cors());

app.get('/api/data', (req, res) => {
  try {
    const cpusLength = os.cpus().length;
    const loadAverage = os.loadavg()[0] / cpusLength;
     res.json({ cpusLength, loadAverage })
  }catch(e){
    res.status(500).json({error: 'Aaaaayy'})
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});