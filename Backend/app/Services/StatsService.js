class StatsService {
    constructor(tripRepository, tripReportRepository, truckRepository) {
        if (!tripRepository || !tripReportRepository || !truckRepository) {
            throw new Error('StatsService requires TripRepository, TripReportRepository, TruckRepository');
        }
        this.tripRepository = tripRepository;
        this.tripReportRepository = tripReportRepository;
        this.truckRepository = truckRepository;
    }

    async getDashboardStats() {
        // Agrégation pour calculer totalDistance et totalFuel en une seule requête
        const reportStats = await this.tripReportRepository.model.aggregate([
            {
                project: {
                    distance: {$ $subtract: ['$endKmReading', '$startKmReading'] },
                    fuel: '$gasoilVolumeFilled'
                }
            },
            {
                $group: {
                    _id: null,
                    totalDistance: { $sum: '$distance' },
                    totalFuel: { $sum: '$fuel' }
                }
            }
        ]);

        const stats = reportStats[0] || { totalDistance: 0, totalFuel: 0 };
        const totalDistance = stats.totalDistance || 0;
        const totalFuel = stats.totalFuel || 0;

        // Calcul de la consommation moyenne
        const averageConsumption = totalDistance > 0 
            ? (totalFuel / totalDistance) * 100 
            : 0;

        // Comptage des camions par statut
        const trucksStatus = await this.truckRepository.model.aggregate([
            {
                $group: {
                    _id: '$isAvailable',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Formatage des résultats pour trucksStatus
        const trucksStatusFormatted = {
            available: 0,
            inMission: 0
        };

        trucksStatus.forEach(status => {
            if (status._id === true) {
                trucksStatusFormatted.available = status.count;
            } else if (status._id === false) {
                trucksStatusFormatted.inMission = status.count;
            }
        });

        return {
            totalDistance,
            totalFuel,
            averageConsumption: Math.round(averageConsumption * 100) / 100,
            trucksStatus: trucksStatusFormatted
        };
    }
}

module.exports = StatsService;
