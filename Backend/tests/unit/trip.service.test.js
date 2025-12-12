const { expect } = require('chai');
const sinon = require('sinon');

const TripService = require('../../app/Services/TripService');

describe('TripService', () => {
    let tripRepositoryStub;
    let userRepositoryStub;
    let truckRepositoryStub;
    let trailerRepositoryStub;
    let tripService;

    beforeEach(() => {
        tripRepositoryStub = {
            model: {
                find: sinon.stub(),
                findById: sinon.stub(),
            },
            create: sinon.stub(),
            findById: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub(),
            findActiveTripsByDriver: sinon.stub(),
        };

        userRepositoryStub = {
            findById: sinon.stub(),
        };

        truckRepositoryStub = {
            findById: sinon.stub(),
            update: sinon.stub(),
        };

        trailerRepositoryStub = {
            findById: sinon.stub(),
            update: sinon.stub(),
        };

        tripService = new TripService(
            tripRepositoryStub,
            userRepositoryStub,
            truckRepositoryStub,
            trailerRepositoryStub
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createTrip', () => {
        it('devrait créer un trip avec camion et remorque et verrouiller les véhicules', async () => {
            const tripData = {
                driver: 'driver123',
                truck: 'truck456',
                trailer: 'trailer789',
                departurePlace: 'Paris',
                arrivalPlace: 'Lyon',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-02'),
            };

            const fakeDriver = {
                _id: 'driver123',
                role: 'Chauffeur',
            };

            const fakeTruck = {
                _id: 'truck456',
                currentKm: 50000,
                isAvailable: true,
            };

            const fakeTrailer = {
                _id: 'trailer789',
                isAvailable: true,
            };

            const fakeTrip = {
                ...tripData,
                _id: 'trip123',
                status: 'Planned',
                startKm: 50000,
            };

            userRepositoryStub.findById.resolves(fakeDriver);
            tripRepositoryStub.findActiveTripsByDriver.resolves([]);
            truckRepositoryStub.findById.resolves(fakeTruck);
            trailerRepositoryStub.findById.resolves(fakeTrailer);
            tripRepositoryStub.create.resolves(fakeTrip);
            truckRepositoryStub.update.resolves({ ...fakeTruck, isAvailable: false });
            trailerRepositoryStub.update.resolves({ ...fakeTrailer, isAvailable: false });

            const result = await tripService.createTrip(tripData);

            expect(userRepositoryStub.findById.calledOnceWith('driver123')).to.be.true;
            expect(truckRepositoryStub.findById.calledOnceWith('truck456')).to.be.true;
            expect(trailerRepositoryStub.findById.calledOnceWith('trailer789')).to.be.true;
            expect(tripRepositoryStub.create.calledOnce).to.be.true;

            expect(truckRepositoryStub.update.calledOnceWith('truck456', { isAvailable: false })).to.be.true;
            expect(trailerRepositoryStub.update.calledOnceWith('trailer789', { isAvailable: false })).to.be.true;

            expect(result).to.deep.equal(fakeTrip);
        });

        it('devrait créer un trip sans remorque et verrouiller uniquement le camion', async () => {
            const tripData = {
                driver: 'driver123',
                truck: 'truck456',
                departurePlace: 'Paris',
                arrivalPlace: 'Lyon',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-02'),
            };

            const fakeDriver = {
                _id: 'driver123',
                role: 'Chauffeur',
            };

            const fakeTruck = {
                _id: 'truck456',
                currentKm: 30000,
                isAvailable: true,
            };

            const fakeTrip = {
                ...tripData,
                _id: 'trip123',
                status: 'Planned',
                startKm: 30000,
            };

            userRepositoryStub.findById.resolves(fakeDriver);
            tripRepositoryStub.findActiveTripsByDriver.resolves([]);
            truckRepositoryStub.findById.resolves(fakeTruck);
            tripRepositoryStub.create.resolves(fakeTrip);
            truckRepositoryStub.update.resolves({ ...fakeTruck, isAvailable: false });

            const result = await tripService.createTrip(tripData);

            expect(truckRepositoryStub.findById.calledOnceWith('truck456')).to.be.true;
            expect(trailerRepositoryStub.findById.called).to.be.false;
            expect(truckRepositoryStub.update.calledOnceWith('truck456', { isAvailable: false })).to.be.true;
            expect(trailerRepositoryStub.update.called).to.be.false;

            expect(result).to.deep.equal(fakeTrip);
        });

        it('devrait lancer une erreur 400 si le camion n\'est pas disponible', async () => {
            const tripData = {
                driver: 'driver123',
                truck: 'truck456',
                departurePlace: 'Paris',
                arrivalPlace: 'Lyon',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-02'),
            };

            const fakeDriver = {
                _id: 'driver123',
                role: 'Chauffeur',
            };

            const fakeTruck = {
                _id: 'truck456',
                currentKm: 50000,
                isAvailable: false,
            };

            userRepositoryStub.findById.resolves(fakeDriver);
            tripRepositoryStub.findActiveTripsByDriver.resolves([]);
            truckRepositoryStub.findById.resolves(fakeTruck);

            try {
                await tripService.createTrip(tripData);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.message).to.include('not available');
                expect(tripRepositoryStub.create.called).to.be.false;
                expect(truckRepositoryStub.update.called).to.be.false;
            }
        });

        it('devrait lancer une erreur 400 si la remorque n\'est pas disponible', async () => {
            const tripData = {
                driver: 'driver123',
                truck: 'truck456',
                trailer: 'trailer789',
                departurePlace: 'Paris',
                arrivalPlace: 'Lyon',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-02'),
            };

            const fakeDriver = {
                _id: 'driver123',
                role: 'Chauffeur',
            };

            const fakeTruck = {
                _id: 'truck456',
                currentKm: 50000,
                isAvailable: true,
            };

            const fakeTrailer = {
                _id: 'trailer789',
                isAvailable: false,
            };

            userRepositoryStub.findById.resolves(fakeDriver);
            tripRepositoryStub.findActiveTripsByDriver.resolves([]);
            truckRepositoryStub.findById.resolves(fakeTruck);
            trailerRepositoryStub.findById.resolves(fakeTrailer);

            try {
                await tripService.createTrip(tripData);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.message).to.include('Trailer is not available');
                expect(tripRepositoryStub.create.called).to.be.false;
            }
        });
    });

    describe('delete', () => {
        it('devrait supprimer un trip et déverrouiller le camion et la remorque', async () => {
            const tripId = 'trip123';

            const fakeTruck = {
                _id: 'truck456',
                isAvailable: false,
            };

            const fakeTrailer = {
                _id: 'trailer789',
                isAvailable: false,
            };

            const fakeTrip = {
                _id: tripId,
                driver: 'driver123',
                truck: fakeTruck,
                trailer: fakeTrailer,
            };

            // Mock en chaîne pour findById().populate('truck').populate('trailer')
            // Le mockQuery doit être awaitable (promesse) et avoir populate qui retourne this
            const mockQuery = Promise.resolve(fakeTrip);
            mockQuery.populate = sinon.stub().returns(mockQuery);

            tripRepositoryStub.model.findById.withArgs(tripId).returns(mockQuery);
            truckRepositoryStub.update.resolves({ ...fakeTruck, isAvailable: true });
            trailerRepositoryStub.update.resolves({ ...fakeTrailer, isAvailable: true });
            tripRepositoryStub.delete.resolves(fakeTrip);

            await tripService.delete(tripId);

            expect(tripRepositoryStub.model.findById.calledOnceWith(tripId)).to.be.true;
            expect(mockQuery.populate.calledWith('truck')).to.be.true;
            expect(mockQuery.populate.calledWith('trailer')).to.be.true;
            expect(truckRepositoryStub.update.calledOnceWith('truck456', { isAvailable: true })).to.be.true;
            expect(trailerRepositoryStub.update.calledOnceWith('trailer789', { isAvailable: true })).to.be.true;
            expect(tripRepositoryStub.delete.calledOnceWith(tripId)).to.be.true;
        });

        it('devrait supprimer un trip solo et déverrouiller uniquement le camion', async () => {
            const tripId = 'trip123';

            const fakeTruck = {
                _id: 'truck456',
                isAvailable: false,
            };

            const fakeTrip = {
                _id: tripId,
                driver: 'driver123',
                truck: fakeTruck,
                trailer: null,
            };

            // Mock en chaîne pour findById().populate('truck').populate('trailer')
            const mockQuery = Promise.resolve(fakeTrip);
            mockQuery.populate = sinon.stub().returns(mockQuery);

            tripRepositoryStub.model.findById.withArgs(tripId).returns(mockQuery);
            truckRepositoryStub.update.resolves({ ...fakeTruck, isAvailable: true });
            tripRepositoryStub.delete.resolves(fakeTrip);

            await tripService.delete(tripId);

            expect(truckRepositoryStub.update.calledOnceWith('truck456', { isAvailable: true })).to.be.true;
            expect(trailerRepositoryStub.update.called).to.be.false;
            expect(tripRepositoryStub.delete.calledOnceWith(tripId)).to.be.true;
        });

        it('devrait lancer une erreur 404 si le trip n\'existe pas', async () => {
            const tripId = 'trip999';

            // Mock en chaîne pour findById().populate('truck').populate('trailer')
            const mockQuery = Promise.resolve(null);
            mockQuery.populate = sinon.stub().returns(mockQuery);

            tripRepositoryStub.model.findById.withArgs(tripId).returns(mockQuery);

            try {
                await tripService.delete(tripId);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('Trip not found');
                expect(truckRepositoryStub.update.called).to.be.false;
                expect(tripRepositoryStub.delete.called).to.be.false;
            }
        });
    });

    describe('update', () => {
        it('devrait filtrer les champs interdits (truck, driver, trailer)', async () => {
            const tripId = 'trip123';
            const updateData = {
                arrivalPlace: 'New York',
                truck: 'NEW_TRUCK_ID',
                driver: 'NEW_DRIVER_ID',
                trailer: 'NEW_TRAILER_ID',
                comments: 'Updated comment',
            };

            const fakeTrip = {
                _id: tripId,
                driver: 'driver123',
                truck: 'truck456',
            };

            const updatedTrip = {
                ...fakeTrip,
                arrivalPlace: 'New York',
                comments: 'Updated comment',
            };

            tripRepositoryStub.findById.resolves(fakeTrip);
            tripRepositoryStub.update.resolves(updatedTrip);

            await tripService.update(tripId, updateData);

            expect(tripRepositoryStub.findById.calledOnceWith(tripId)).to.be.true;

            const updateCall = tripRepositoryStub.update.getCall(0);
            expect(updateCall.args[0]).to.equal(tripId);
            const sanitizedData = updateCall.args[1];

            expect(sanitizedData).to.have.property('arrivalPlace', 'New York');
            expect(sanitizedData).to.have.property('comments', 'Updated comment');
            expect(sanitizedData).to.not.have.property('truck');
            expect(sanitizedData).to.not.have.property('driver');
            expect(sanitizedData).to.not.have.property('trailer');
        });

        it('devrait lancer une erreur 404 si le trip n\'existe pas', async () => {
            const tripId = 'trip999';
            const updateData = { arrivalPlace: 'New York' };

            tripRepositoryStub.findById.resolves(null);

            try {
                await tripService.update(tripId, updateData);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('Trip not found');
                expect(tripRepositoryStub.update.called).to.be.false;
            }
        });
    });
});

