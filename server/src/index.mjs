import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import routes from './routes/Routes.mjs'

const app = express()
const PORT = process.env.PORT || 3007

app.use(morgan(':date[clf] :method :url :status :response-time ms'))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(PORT, () => {
    console.log(`running on PORT ${PORT}`)
})

app.get('/',(req,res) => {
    res.status(200).send({msg:"here is diary server"})
})

app.use('/api', routes)