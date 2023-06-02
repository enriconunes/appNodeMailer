const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const port = 3000

// configuração banco de dados
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'plataforma_interna'
    }
});

// receber informações do formulario
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// credenciais google
const user = "<endereco de email>"
const pass = "<app password>"

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.listen(port, () => console.log(`Running on port ${port}`))

app.post('/send', (req, res) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {user, pass}
    })

    transporter.sendMail({
        from: user,
        to: user,
        subject: `Assunto: ${req.body.subject}`,
        text: `Descrição: ${req.body.description}\nEnviado por: ${req.body.email}`
    }).then(info => {

        // salvar no banco de dados
        var data = {
            subject: req.body.subject,
            message: req.body.description,
            userFrom: req.body.email,
            userTo: user,
        }

        knex.insert(data).into("emails").then(info => {
            // print do id se der tudo certo
            console.log(info);
        }).catch(err => {
            console.log(err)
        });

        res.send("Mensagem enviada com sucesso!")
        
    }).catch(error => {
        res.send(`ERRO: ${error}\n\nTente novamente mais tarde!`)
    })
    

})
