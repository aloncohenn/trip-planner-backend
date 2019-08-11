const express = require('express');
const TripService = require('./trips-service');
const requireAuth = require('../middleware/requireAuth');

const tripsRouter = express.Router();
const jsonBodyParser = express.json();

// Post New Trip
tripsRouter
  .route('/new_trip')
  .post(jsonBodyParser, requireAuth, (req, res, next) => {
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

    TripService.insertTrip(req.app.get('db'), newTrip)
      .then(trip => {
        return res.status(201).json(TripService.serializeTrip(trip));
      })
      .catch(next);
  });

// Get All Trips
tripsRouter.route('/get_trips/:user_id').get(requireAuth, (req, res, next) => {
  const { user_id } = req.params;
  TripService.getTrips(req.app.get('db'), user_id)
    .then(tripList => {
      return res.status(200).json(tripList);
    })
    .catch(next);
});

// Update Trip
tripsRouter
  .route('/update_trip')
  .put(jsonBodyParser, requireAuth, (req, res, next) => {
    const data = { ...req.body };
    TripService.updateTrip(req.app.get('db'), data)
      .then(trip => {
        return res.status(204).json(trip);
      })
      .catch(next);
  });

// Delete Trip
tripsRouter
  .route('/delete_trip')
  .delete(jsonBodyParser, requireAuth, (req, res, next) => {
    const { trip_id } = req.body;

    TripService.deleteTrip(req.app.get('db'), trip_id)
      .then(trip => {
        return res.status(200).json(trip);
      })
      .catch(next);
  });

tripsRouter
  .route('/get_trip/:user_id/:id')
  .get(jsonBodyParser, requireAuth, (req, res, next) => {
    const { user_id, id } = req.params;

    const data = {
      user_id,
      id
    };

    TripService.getTripByID(req.app.get('db'), data)
      .then(trip => {
        return res.status(200).json(trip);
      })
      .catch(next);
  });

module.exports = tripsRouter;
