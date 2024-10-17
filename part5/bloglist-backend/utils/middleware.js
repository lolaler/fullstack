const { request } = require('express')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('Headers:', request.headers)
  logger.info('---')
  next()
}


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  console.log('auth header: ', authorization)
  const token = authorization && authorization.startsWith('Bearer ') ? authorization.replace('Bearer ', '') : null
  request.token = token
  console.log('tokenExtractor: extracted token from request', token)
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log('userExtractor: decoded token is ', decodedToken)
  const user = await User.findById(decodedToken.id)
  if (user) {
    request.user = user
    console.log('userExtractor: found user ', user)
  } else {
    response.status(404).json({ error: 'user not found' })
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }


  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}