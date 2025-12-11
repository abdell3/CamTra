const { expect } = require('chai');
const sinon = require('sinon');

const TruckService = require('../../app/Services/TruckService');
const TrailerService = require('../../app/Services/TrailerService');

describe('Fleet Services', () => {
    describe('TruckService', () => {
        let truckRepositoryStub;
        let truckService;

        beforeEach(() => {
            truckRepositoryStub = {
                model: {
                    find: sinon.stub(),
                },
                create: sinon.stub(),
                findById: sinon.stub(),
                update: sinon.stub(),
                delete: sinon.stub(),
            };

            truckService = new TruckService(truckRepositoryStub);
        });

        afterEach(() => {
            sinon.restore();
        });

        describe('getAll', () => {
            it('devrait appeler model.find({}) et retourner les résultats', async () => {
                const fakeTrucks = [
                    { id: '1', immatriculation: 'TR-001', marque: 'Volvo' },
                    { id: '2', immatriculation: 'TR-002', marque: 'Scania' },
                ];

                truckRepositoryStub.model.find.resolves(fakeTrucks);

                const result = await truckService.getAll();

                expect(truckRepositoryStub.model.find.calledOnceWith({})).to.be.true;
                expect(result).to.deep.equal(fakeTrucks);
            });
        });

        describe('getById', () => {
            it('devrait retourner un camion si trouvé', async () => {
                const truckId = '123';
                const fakeTruck = {
                    id: truckId,
                    immatriculation: 'TR-001',
                    marque: 'Volvo',
                    modele: 'FH16',
                };

                truckRepositoryStub.findById.resolves(fakeTruck);

                const result = await truckService.getById(truckId);

                expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                expect(result).to.deep.equal(fakeTruck);
            });

            it('devrait lancer une erreur 404 si camion non trouvé', async () => {
                const truckId = '999';

                truckRepositoryStub.findById.resolves(null);

                try {
                    await truckService.getById(truckId);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Truck not found');
                    expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                }
            });
        });

        describe('update', () => {
            it('devrait mettre à jour un camion si trouvé', async () => {
                const truckId = '123';
                const existingTruck = {
                    id: truckId,
                    immatriculation: 'TR-001',
                    marque: 'Volvo',
                };
                const updateData = { marque: 'Scania', currentKm: 50000 };
                const updatedTruck = { ...existingTruck, ...updateData };

                truckRepositoryStub.findById.resolves(existingTruck);
                truckRepositoryStub.update.resolves(updatedTruck);

                const result = await truckService.update(truckId, updateData);

                expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                expect(truckRepositoryStub.update.calledOnce).to.be.true;
                expect(truckRepositoryStub.update.calledWith(truckId, updateData)).to.be.true;
                expect(result).to.deep.equal(updatedTruck);
            });

            it('devrait lancer une erreur 404 si camion non trouvé', async () => {
                const truckId = '999';
                const updateData = { marque: 'Scania' };

                truckRepositoryStub.findById.resolves(null);

                try {
                    await truckService.update(truckId, updateData);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Truck not found');
                    expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                    expect(truckRepositoryStub.update.called).to.be.false;
                }
            });
        });

        describe('delete', () => {
            it('devrait supprimer un camion si trouvé', async () => {
                const truckId = '123';
                const fakeTruck = {
                    id: truckId,
                    immatriculation: 'TR-001',
                    marque: 'Volvo',
                };

                truckRepositoryStub.findById.resolves(fakeTruck);
                truckRepositoryStub.delete.resolves(fakeTruck);

                const result = await truckService.delete(truckId);

                expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                expect(truckRepositoryStub.delete.calledOnceWith(truckId)).to.be.true;
                expect(result).to.deep.equal(fakeTruck);
            });

            it('devrait lancer une erreur 404 si camion non trouvé', async () => {
                const truckId = '999';

                truckRepositoryStub.findById.resolves(null);

                try {
                    await truckService.delete(truckId);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Truck not found');
                    expect(truckRepositoryStub.findById.calledOnceWith(truckId)).to.be.true;
                    expect(truckRepositoryStub.delete.called).to.be.false;
                }
            });
        });
    });

    describe('TrailerService', () => {
        let trailerRepositoryStub;
        let trailerService;

        beforeEach(() => {
            trailerRepositoryStub = {
                model: {
                    find: sinon.stub(),
                },
                create: sinon.stub(),
                findById: sinon.stub(),
                update: sinon.stub(),
                delete: sinon.stub(),
            };

            trailerService = new TrailerService(trailerRepositoryStub);
        });

        afterEach(() => {
            sinon.restore();
        });

        describe('getAll', () => {
            it('devrait appeler model.find({}) et retourner les résultats', async () => {
                const fakeTrailers = [
                    { id: '1', immatriculation: 'TRL-001', marque: 'Schmitz' },
                    { id: '2', immatriculation: 'TRL-002', marque: 'Krone' },
                ];

                trailerRepositoryStub.model.find.resolves(fakeTrailers);

                const result = await trailerService.getAll();

                expect(trailerRepositoryStub.model.find.calledOnceWith({})).to.be.true;
                expect(result).to.deep.equal(fakeTrailers);
            });
        });

        describe('getById', () => {
            it('devrait retourner une remorque si trouvée', async () => {
                const trailerId = '123';
                const fakeTrailer = {
                    id: trailerId,
                    immatriculation: 'TRL-001',
                    marque: 'Schmitz',
                    modele: 'Cargobull',
                };

                trailerRepositoryStub.findById.resolves(fakeTrailer);

                const result = await trailerService.getById(trailerId);

                expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                expect(result).to.deep.equal(fakeTrailer);
            });

            it('devrait lancer une erreur 404 si remorque non trouvée', async () => {
                const trailerId = '999';

                trailerRepositoryStub.findById.resolves(null);

                try {
                    await trailerService.getById(trailerId);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Trailer not found');
                    expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                }
            });
        });

        describe('update', () => {
            it('devrait mettre à jour une remorque si trouvée', async () => {
                const trailerId = '123';
                const existingTrailer = {
                    id: trailerId,
                    immatriculation: 'TRL-001',
                    marque: 'Schmitz',
                };
                const updateData = { marque: 'Krone', isAvailable: false };
                const updatedTrailer = { ...existingTrailer, ...updateData };

                trailerRepositoryStub.findById.resolves(existingTrailer);
                trailerRepositoryStub.update.resolves(updatedTrailer);

                const result = await trailerService.update(trailerId, updateData);

                expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                expect(trailerRepositoryStub.update.calledOnce).to.be.true;
                expect(trailerRepositoryStub.update.calledWith(trailerId, updateData)).to.be.true;
                expect(result).to.deep.equal(updatedTrailer);
            });

            it('devrait lancer une erreur 404 si remorque non trouvée', async () => {
                const trailerId = '999';
                const updateData = { marque: 'Krone' };

                trailerRepositoryStub.findById.resolves(null);

                try {
                    await trailerService.update(trailerId, updateData);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Trailer not found');
                    expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                    expect(trailerRepositoryStub.update.called).to.be.false;
                }
            });
        });

        describe('delete', () => {
            it('devrait supprimer une remorque si trouvée', async () => {
                const trailerId = '123';
                const fakeTrailer = {
                    id: trailerId,
                    immatriculation: 'TRL-001',
                    marque: 'Schmitz',
                };

                trailerRepositoryStub.findById.resolves(fakeTrailer);
                trailerRepositoryStub.delete.resolves(fakeTrailer);

                const result = await trailerService.delete(trailerId);

                expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                expect(trailerRepositoryStub.delete.calledOnceWith(trailerId)).to.be.true;
                expect(result).to.deep.equal(fakeTrailer);
            });

            it('devrait lancer une erreur 404 si remorque non trouvée', async () => {
                const trailerId = '999';

                trailerRepositoryStub.findById.resolves(null);

                try {
                    await trailerService.delete(trailerId);
                    throw new Error('should have thrown');
                } catch (error) {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(404);
                    expect(error.message).to.equal('Trailer not found');
                    expect(trailerRepositoryStub.findById.calledOnceWith(trailerId)).to.be.true;
                    expect(trailerRepositoryStub.delete.called).to.be.false;
                }
            });
        });
    });
});

