import { useEffect, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const ReportModal = ({ trip, isOpen, onClose, onSubmit }) => {
  const startKm = trip?.startKm ?? 0;
  const [endKm, setEndKm] = useState('');
  const [gasoilVolume, setGasoilVolume] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEndKm('');
      setGasoilVolume('');
      setRemarks('');
    }
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  const parsedEndKm = Number(endKm);
  const parsedStartKm = Number(startKm || 0);
  const isInvalid = Number.isNaN(parsedEndKm) || parsedEndKm < parsedStartKm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;
    onSubmit({
      tripId: trip._id,
      startKmReading: parsedStartKm,
      endKmReading: parsedEndKm,
      gasoilVolumeFilled: gasoilVolume ? Number(gasoilVolume) : undefined,
      driverRemarks: remarks || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="w-full max-w-lg bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold text-white">Clôturer la mission</h2>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Mission : {trip.departureSite} → {trip.arrivalSite}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Kilométrage Départ</label>
            <input
              type="number"
              value={startKm}
              disabled
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-300 placeholder:text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Kilométrage Arrivée *</label>
            <input
              type="number"
              value={endKm}
              onChange={(e) => setEndKm(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
            />
            {parsedEndKm < parsedStartKm && endKm !== '' && (
              <p className="text-xs text-red-300">Le kilométrage arrivée doit être supérieur ou égal au départ.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Volume Gasoil (L)</label>
            <input
              type="number"
              value={gasoilVolume}
              onChange={(e) => setGasoilVolume(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Remarques</label>
            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="Observations, incidents, etc."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clôturer la mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

