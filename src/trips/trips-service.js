const xss = require('xss');

const TripService = {
  serializeTrip(trip) {
    return {
      user_id: trip.user_id,
      title: xss(trip.title),
      destination: xss(trip.destination),
      start_date: xss(trip.start_date),
      end_date: xss(trip.end_date)
    };
  },
  insertTrip(db, newTrip) {
    return db('trip_record')
      .insert(newTrip)
      .returning('*')
      .then(([trip]) => trip);
  },
  deleteTrip(db, trip_id) {
    return db('trip_record')
      .where({ trip_id })
      .delete();
  },
  getTrips(db, user_id) {
    return db('trip_record')
      .select('*')
      .where({ user_id });
  },
  updateTrip(db, trip) {
    return db('trip_record')
      .where('title', trip.title)
      .where('user_id', trip.user_id)
      .update(`${trip.update}`, trip.update);
  }
};

module.exports = TripService;
