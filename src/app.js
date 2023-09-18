import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import hbs from 'hbs';
import { geocode } from './utils/geocode.js';
import { forecast } from './utils/forecast.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths for express config
const publicDirPath = join(__dirname, '../public')
const viewsPath = join(__dirname, '../templates/views')
const partialsPath = join(__dirname, '../templates/partials')

const app = express();

// Setup hbs engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static dir to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Dmitrii Nikiforov'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Dmitrii Nikiforov'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Dmitrii Nikiforov'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    } else {
    geocode(address, (error, { latitude, longtitude, location } = {}) => {
        if (error) {
            return res.send(error);
        }
        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send(error);
            }
            res.send({
                location,
                forecast: forecastData,
                address
            })
        })
    })}
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Dmitrii Nikiforov', 
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Dmitrii Nikiforov', 
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
})