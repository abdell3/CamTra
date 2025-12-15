import { useEffect, useState } from 'react';
import { Plus, AlertTriangle, Settings, Wrench, Truck, AlertCircle, Pencil } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const severityBadge = {
  Critical: 'bg-red-500/20 text-red-200 border border-red-400/30',
  Warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
  Low: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  Medium: 'bg-orange-500/20 text-orange-200 border border-orange-400/30',
  High: 'bg-red-500/20 text-red-200 border border-red-400/30',
};

const AlertsTab = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
        <div className="h-10 w-32 bg-white/10 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center text-slate-200 shadow-xl">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-400" />
        <p>Aucune alerte de maintenance en cours.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span className="text-sm">Alertes de maintenance</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Camion</th>
              <th className="px-4 py-3 font-semibold">Règle</th>
              <th className="px-4 py-3 font-semibold">Km Actuel</th>
              <th className="px-4 py-3 font-semibold">Échéance</th>
              <th className="px-4 py-3 font-semibold">Reste</th>
              <th className="px-4 py-3 font-semibold">Sévérité</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-slate-200 font-semibold">{alert.truckImmat || '—'}</td>
                <td className="px-4 py-3 text-white">{alert.ruleName || '—'}</td>
                <td className="px-4 py-3 text-slate-200">{alert.currentKm?.toLocaleString('fr-FR') || '—'} km</td>
                <td className="px-4 py-3 text-slate-200">{alert.dueKm?.toLocaleString('fr-FR') || '—'} km</td>
                <td className="px-4 py-3 text-slate-200">{alert.remainingKm?.toLocaleString('fr-FR') || '—'} km</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      severityBadge[alert.severity] || 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {alert.severity || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CreateRuleModal = ({ isOpen, onClose, onSubmit, editingRule = null }) => {
  const [name, setName] = useState('');
  const [targetEntityType, setTargetEntityType] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [periodKm, setPeriodKm] = useState('');
  const [periodMonths, setPeriodMonths] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!editingRule;

  useEffect(() => {
    if (isOpen) {
      if (editingRule) {
        setName(editingRule.name || '');
        setTargetEntityType(editingRule.targetEntityType || '');
        setSeverity(editingRule.severity || 'Medium');
        setPeriodKm(editingRule.periodKm ? String(editingRule.periodKm) : '');
        setPeriodMonths(editingRule.periodMonths ? String(editingRule.periodMonths) : '');
        setDescription(editingRule.description || '');
      } else {
        setName('');
        setTargetEntityType('');
        setSeverity('Medium');
        setPeriodKm('');
        setPeriodMonths('');
        setDescription('');
      }
    }
  }, [isOpen, editingRule]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const payload = {
        name,
        targetEntityType,
        severity,
        description: description || undefined,
      };

      if (targetEntityType === 'Truck') {
        if (!periodKm && !periodMonths) {
          toast.error('Une règle pour camion doit avoir au moins periodKm ou periodMonths');
          return;
        }
        if (periodKm) payload.periodKm = Number(periodKm);
        if (periodMonths) payload.periodMonths = Number(periodMonths);
      } else if (targetEntityType === 'Trailer') {
        if (!periodMonths) {
          toast.error('Une règle pour remorque doit avoir periodMonths');
          return;
        }
        if (periodKm) {
          toast.error('Une remorque ne peut pas avoir periodKm');
          return;
        }
        payload.periodMonths = Number(periodMonths);
      }

      await onSubmit(payload, editingRule?._id);
      onClose();
    } catch (err) {
      // onSubmit gère le toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-white mb-1">
          {isEditMode ? 'Modifier la Règle de Maintenance' : 'Nouvelle Règle de Maintenance'}
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          {isEditMode ? 'Modifier les informations de la règle' : 'Définir une règle de maintenance périodique'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Nom de la règle *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="Ex: Vidange moteur"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Type d'entité *</label>
              <select
                required
                value={targetEntityType}
                onChange={(e) => {
                  setTargetEntityType(e.target.value);
                  if (e.target.value === 'Trailer') {
                    setPeriodKm('');
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              >
                <option value="">Sélectionner</option>
                <option value="Truck">Camion</option>
                <option value="Trailer">Remorque</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Sévérité *</label>
              <select
                required
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {targetEntityType === 'Truck' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Période (Km)</label>
                <input
                  type="number"
                  min="0"
                  value={periodKm}
                  onChange={(e) => setPeriodKm(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                  placeholder="Ex: 10000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Période (Mois)</label>
                <input
                  type="number"
                  min="0"
                  value={periodMonths}
                  onChange={(e) => setPeriodMonths(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                  placeholder="Ex: 6"
                />
              </div>
            </div>
          )}

          {targetEntityType === 'Trailer' && (
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Période (Mois) *</label>
              <input
                type="number"
                required
                min="0"
                value={periodMonths}
                onChange={(e) => setPeriodMonths(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Ex: 12"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="Description optionnelle de la règle"
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
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              {loading ? (isEditMode ? 'Modification...' : 'Création...') : (isEditMode ? 'Modifier la règle' : 'Créer la règle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RulesTab = ({ rules, loading, onCreateRule, onEditRule, onDeleteRule }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
        <div className="h-10 w-32 bg-white/10 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center text-slate-200 shadow-xl">
        <Settings className="h-12 w-12 mx-auto mb-3 text-slate-400" />
        <p>Aucune règle de maintenance définie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Settings className="h-4 w-4 text-cyan-400" />
            <span className="text-sm">Règles de maintenance</span>
          </div>
        </div>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule._id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{rule.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        severityBadge[rule.severity] || 'bg-white/10 text-white'
                      }`}
                    >
                      {rule.severity}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                      {rule.targetEntityType}
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-sm text-slate-300 mb-2">{rule.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    {rule.periodKm && (
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {rule.periodKm.toLocaleString('fr-FR')} km
                      </span>
                    )}
                    {rule.periodMonths && (
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {rule.periodMonths} mois
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditRule(rule)}
                    className="px-3 py-1 text-sm text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRule(rule._id)}
                    className="px-3 py-1 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminMaintenance = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [rules, setRules] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const loadAlerts = async () => {
    try {
      setAlertsLoading(true);
      const { data } = await api.get('/maintenance/alerts');
      setAlerts(data?.alerts || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les alertes';
      toast.error(message);
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      setRulesLoading(true);
      const { data } = await api.get('/maintenance-rules');
      setRules(data?.rules || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les règles';
      toast.error(message);
    } finally {
      setRulesLoading(false);
    }
  };

  const handleSubmitRule = async (payload, ruleId) => {
    try {
      if (ruleId) {
        await api.put(`/maintenance-rules/${ruleId}`, payload);
        toast.success('Règle de maintenance modifiée avec succès');
      } else {
        await api.post('/maintenance-rules', payload);
        toast.success('Règle de maintenance créée avec succès');
      }
      await loadRules();
    } catch (err) {
      const message = err.response?.data?.message || `Erreur lors de la ${ruleId ? 'modification' : 'création'} de la règle`;
      toast.error(message);
      throw err;
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) {
      return;
    }
    try {
      await api.delete(`/maintenance-rules/${id}`);
      toast.success('Règle supprimée avec succès');
      await loadRules();
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression de la règle';
      toast.error(message);
    }
  };

  useEffect(() => {
    if (activeTab === 'alerts') {
      loadAlerts();
    } else {
      loadRules();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-sm text-slate-300">Gestion des alertes et règles de maintenance</p>
        </div>
        {activeTab === 'rules' && (
          <button
            type="button"
            onClick={() => {
              setEditingRule(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Règle
          </button>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-1 shadow-xl">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'alerts'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertes en cours
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'rules'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              Règles de Maintenance
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'alerts' && <AlertsTab alerts={alerts} loading={alertsLoading} />}
      {activeTab === 'rules' && (
        <RulesTab
          rules={rules}
          loading={rulesLoading}
          onCreateRule={handleSubmitRule}
          onEditRule={handleEditRule}
          onDeleteRule={handleDeleteRule}
        />
      )}

      <CreateRuleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRule(null);
        }}
        onSubmit={handleSubmitRule}
        editingRule={editingRule}
      />
    </div>
  );
};

export default AdminMaintenance;

