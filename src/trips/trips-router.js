const express = require('express');
const TripService = require('./trips-service');
const requireAuth = require('../middleware/jwt-auth');

const tripsRouter = express.Router();
const jsonBodyParser = express.json();

// Post New Trip
tripsRouter
  .all(requireAuth)
  .route('/new_trip')
  .post(jsonBodyParser, (req, res, next) => {
    const {
      user_id,
      title,
      destination,
      category,
      start_date,
      end_date
    } = req.body;

    const newTrip = {
      user_id,
      title,
      destination,
      category,
      start_date,
      end_date
    };

    for (const [key, value] of Object.entries(newTrip)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    TripService.getTrips(req.app.get('db'), user_id)
      .then(tripList => {
        const checkIfExists = tripList.filter(trip => trip.title === title);
        if (checkIfExists.length > 0) {
          return res.status(400).json({
            error: `This title is already in your Trip List!`
          });
        }
        TripService.insertTrip(req.app.get('db'), newTrip)
          .then(trip => {
            return res.status(201).json(TripService.serializeTrip(trip));
          })
          .catch(next);
      })
      .catch(next);
  });

// Get All Trips
tripsRouter
  .all(requireAuth)
  .route('/get_trips/:user_id')
  .get((req, res, next) => {
    const { user_id } = req.params;
    TripService.getTrips(req.app.get('db'), user_id)
      .then(tripList => {
        return res.status(200).json(tripList);
      })
      .catch(next);
  });

tripsRouter
  .all(requireAuth)
  .route('/:user_id/update')
  .put(jsonBodyParser, (req, res, next) => {
    const { user_id, title, destination, start_date, end_date } = req.body;

    const data = {
      user_id,
      title,
      destination,
      start_date,
      end_date
    };

    TripService.updateTrip(req.app.get('db'), data)
      .then(trip => {
        return res.status(204).json(trip);
      })
      .catch(next);
  });

// Delete Trip

tripsRouter
  .all(requireAuth)
  .route('/delete_trip')
  .delete(jsonBodyParser, (req, res, next) => {
    const { trip_id } = req.body;

    const data = {
      trip_id
    };

    TripService.deleteTrip(req.app.get('db'), data)
      .then(trip => {
        return res.status(200).json(trip);
      })
      .catch(next);
  });

module.exports = tripsRouter;
