import { useEffect, useState } from 'react';
import { Play, Truck, MapPin, Clock3, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const statusStyles = {
  Planned: 'border-l-4 border-yellow-400',
  InProgress: 'border-l-4 border-blue-400',
  Completed: 'border-l-4 border-green-500',
};

const statusLabel = {
  Planned: 'Planifiée',
  InProgress: 'En cours',
  Completed: 'Terminée',
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/trips/my-trips');
      setTrips(data.trips || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les missions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleStart = async (tripId) => {
    try {
      setActionId(tripId);
      await api.patch(`/trips/${tripId}/start`);
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? { ...trip, status: 'InProgress' } : trip
        )
      );
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de démarrer la mission';
      setError(message);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-night">
        Chargement des missions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-night">Mes Missions</h1>
          <p className="text-sm text-gray-600">Les missions qui vous sont assignées.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-red-50 px-3 py-2 text-danger text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
          Aucune mission assignée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => {
            const planned = formatDate(trip.plannedStartDate);
            const plannedEnd = formatDate(trip.plannedEndDate);
            const statusClass = statusStyles[trip.status] || 'border-l-4 border-gray-200';
            const truckInfo = trip.assignedTruckId
              ? `${trip.assignedTruckId.brand || ''} ${trip.assignedTruckId.immatriculation || ''}`.trim()
              : 'Camion non assigné';

            return (
              <div
                key={trip._id}
                className={`bg-white shadow-sm rounded-lg p-4 flex flex-col gap-3 ${statusClass}`}
              >
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-gray-400" />
                    <span>{planned}</span>
                  </div>
                  <span className="text-xs font-semibold uppercase text-gray-600">
                    {statusLabel[trip.status] || trip.status}
                  </span>
                </div>

                <div>
                  <div className="text-lg font-semibold text-night">
                    {trip.departureSite} → {trip.arrivalSite}
                  </div>
                  <div className="text-sm text-gray-500">
                    Fin prévue : {plannedEnd}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>{truckInfo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>ID: {trip._id.slice(-6)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {trip.status === 'Planned' && (
                    <button
                      type="button"
                      onClick={() => handleStart(trip._id)}
                      disabled={actionId === trip._id}
                      className="inline-flex items-center gap-2 rounded-lg bg-brick px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brick-light disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Play className="h-4 w-4" />
                      {actionId === trip._id ? 'Démarrage...' : 'Démarrer'}
                    </button>
                  )}

                  {trip.status === 'InProgress' && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-night px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-night-light"
                    >
                      Terminer / Rapport
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverTrips;

