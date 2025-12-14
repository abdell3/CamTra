const { expect } = require('chai');
const sinon = require('sinon');

const TireService = require('../../app/Services/TireService');

describe('TireService', () => {
    let tireRepositoryStub;
    let truckRepositoryStub;
    let trailerRepositoryStub;
    let tireService;

    beforeEach(() => {
        tireRepositoryStub = {
            model: {
                find: sinon.stub(),
            },
            create: sinon.stub(),
            findById: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub(),
        };

        truckRepositoryStub = {
            findById: sinon.stub(),
        };

        trailerRepositoryStub = {
            findById: sinon.stub(),
        };

        tireService = new TireService(tireRepositoryStub, truckRepositoryStub, trailerRepositoryStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('mountTire', () => {
        it('devrait monter un pneu Neuf sur un Truck et capturer currentKm', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck456';
            const vehicleType = 'Truck';
            const position = 'AVG';

            const fakeTire = {
                id: tireId,
                status: 'Neuf',
                mountedOnEntity: null,
                mountedOnModel: null,
            };

            const fakeTruck = {
                id: vehicleId,
                currentKm: 50000,
            };

            const updatedTire = {
                ...fakeTire,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Truck',
                position: position,
                mountedAtKm: 50000,
                status: 'Bon',
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            truckRepositoryStub.findById.resolves(fakeTruck);
            tireRepositoryStub.update.resolves(updatedTire);

            const result = await tireService.mountTire(tireId, vehicleId, vehicleType, position);

            expect(tireRepositoryStub.findById.calledOnceWith(tireId)).to.be.true;
            expect(truckRepositoryStub.findById.calledOnceWith(vehicleId)).to.be.true;
            expect(tireRepositoryStub.update.calledOnce).to.be.true;

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[0]).to.equal(tireId);
            expect(updateCall.args[1]).to.deep.include({
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Truck',
                position: position,
                mountedAtKm: 50000,
                status: 'Bon',
            });

            expect(result).to.deep.equal(updatedTire);
        });

        it('devrait monter un pneu sur un Trailer et capturer currentKm', async () => {
            const tireId = 'tire123';
            const vehicleId = 'trailer789';
            const vehicleType = 'Trailer';
            const position = 'Essieu1-G';

            const fakeTire = {
                id: tireId,
                status: 'Bon',
                mountedOnEntity: null,
            };

            const fakeTrailer = {
                id: vehicleId,
                currentKm: 30000,
            };

            const updatedTire = {
                ...fakeTire,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Trailer',
                position: position,
                mountedAtKm: 30000,
                status: 'Bon',
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            trailerRepositoryStub.findById.resolves(fakeTrailer);
            tireRepositoryStub.update.resolves(updatedTire);

            const result = await tireService.mountTire(tireId, vehicleId, vehicleType, position);

            expect(tireRepositoryStub.findById.calledOnceWith(tireId)).to.be.true;
            expect(trailerRepositoryStub.findById.calledOnceWith(vehicleId)).to.be.true;

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[1].mountedAtKm).to.equal(30000);
            expect(result).to.deep.equal(updatedTire);
        });

        it('devrait lancer une erreur 404 si le véhicule n\'existe pas', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck999';
            const vehicleType = 'Truck';
            const position = 'AVG';

            const fakeTire = {
                id: tireId,
                status: 'Bon',
                mountedOnEntity: null,
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            truckRepositoryStub.findById.resolves(null);

            try {
                await tireService.mountTire(tireId, vehicleId, vehicleType, position);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('Truck not found');
            }
        });

        it('devrait lancer une erreur 400 si le pneu est déjà monté', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck456';
            const vehicleType = 'Truck';
            const position = 'AVG';

            const fakeTire = {
                id: tireId,
                status: 'Bon',
                mountedOnEntity: 'existingVehicleId',
                mountedOnModel: 'Truck',
            };

            tireRepositoryStub.findById.resolves(fakeTire);

            try {
                await tireService.mountTire(tireId, vehicleId, vehicleType, position);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.message).to.include('already mounted');
            }
        });

        it('devrait lancer une erreur 400 si le pneu a le status "Reforme"', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck456';
            const vehicleType = 'Truck';
            const position = 'AVG';

            const fakeTire = {
                id: tireId,
                status: 'Reforme',
                mountedOnEntity: null,
            };

            tireRepositoryStub.findById.resolves(fakeTire);

            try {
                await tireService.mountTire(tireId, vehicleId, vehicleType, position);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.message).to.include('Reforme');
            }
        });
    });

    describe('dismountTire', () => {
        it('devrait démonter un pneu et calculer l\'usure (totalKmDriven)', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck456';

            const fakeTire = {
                id: tireId,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Truck',
                mountedAtKm: 50000,
                totalKmDriven: 0,
                getKmDriven: sinon.stub().returns(2000),
            };

            const fakeTruck = {
                id: vehicleId,
                currentKm: 52000,
            };

            const updatedTire = {
                ...fakeTire,
                mountedOnEntity: null,
                mountedOnModel: null,
                position: null,
                mountedAtKm: 0,
                totalKmDriven: 2000,
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            truckRepositoryStub.findById.resolves(fakeTruck);
            tireRepositoryStub.update.resolves(updatedTire);

            const result = await tireService.dismountTire(tireId);

            expect(tireRepositoryStub.findById.calledOnceWith(tireId)).to.be.true;
            expect(truckRepositoryStub.findById.calledOnceWith(vehicleId)).to.be.true;
            expect(fakeTire.getKmDriven.calledOnceWith(52000)).to.be.true;

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[0]).to.equal(tireId);
            expect(updateCall.args[1]).to.deep.include({
                mountedOnEntity: null,
                mountedOnModel: null,
                position: null,
                mountedAtKm: 0,
                totalKmDriven: 2000,
            });

            expect(result).to.deep.equal(updatedTire);
        });

        it('devrait cumuler l\'usure avec le totalKmDriven existant', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck456';

            const fakeTire = {
                id: tireId,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Truck',
                mountedAtKm: 50000,
                totalKmDriven: 10000,
                getKmDriven: sinon.stub().returns(2000),
            };

            const fakeTruck = {
                id: vehicleId,
                currentKm: 52000,
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            truckRepositoryStub.findById.resolves(fakeTruck);
            tireRepositoryStub.update.resolves({});

            await tireService.dismountTire(tireId);

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[1].totalKmDriven).to.equal(12000);
        });

        it('devrait démonter un pneu monté sur une Trailer', async () => {
            const tireId = 'tire123';
            const vehicleId = 'trailer789';

            const fakeTire = {
                id: tireId,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Trailer',
                mountedAtKm: 30000,
                totalKmDriven: 0,
                getKmDriven: sinon.stub().returns(5000),
            };

            const fakeTrailer = {
                id: vehicleId,
                currentKm: 35000,
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            trailerRepositoryStub.findById.resolves(fakeTrailer);
            tireRepositoryStub.update.resolves({});

            await tireService.dismountTire(tireId);

            expect(trailerRepositoryStub.findById.calledOnceWith(vehicleId)).to.be.true;
            expect(fakeTire.getKmDriven.calledOnceWith(35000)).to.be.true;

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[1].totalKmDriven).to.equal(5000);
        });

        it('devrait lancer une erreur 400 si le pneu n\'est pas monté', async () => {
            const tireId = 'tire123';

            const fakeTire = {
                id: tireId,
                mountedOnEntity: null,
                mountedOnModel: null,
            };

            tireRepositoryStub.findById.resolves(fakeTire);

            try {
                await tireService.dismountTire(tireId);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(400);
                expect(error.message).to.include('not mounted');
            }
        });

        it('devrait lancer une erreur 404 si le véhicule porteur n\'existe pas', async () => {
            const tireId = 'tire123';
            const vehicleId = 'truck999';

            const fakeTire = {
                id: tireId,
                mountedOnEntity: vehicleId,
                mountedOnModel: 'Truck',
                mountedAtKm: 50000,
                getKmDriven: sinon.stub(),
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            truckRepositoryStub.findById.resolves(null);

            try {
                await tireService.dismountTire(tireId);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('Vehicle not found');
            }
        });
    });

    describe('update', () => {
        it('devrait mettre à jour un pneu avec succès', async () => {
            const tireId = 'tire123';
            const updateData = { brand: 'Michelin Updated' };

            const fakeTire = {
                id: tireId,
                brand: 'Michelin',
                model: 'XZA2',
            };

            const updatedTire = {
                ...fakeTire,
                ...updateData,
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            tireRepositoryStub.update.resolves(updatedTire);

            const result = await tireService.update(tireId, updateData);

            expect(tireRepositoryStub.findById.calledOnceWith(tireId)).to.be.true;
            expect(tireRepositoryStub.update.calledOnce).to.be.true;

            const updateCall = tireRepositoryStub.update.getCall(0);
            expect(updateCall.args[0]).to.equal(tireId);
            expect(updateCall.args[1]).to.deep.include(updateData);
            expect(result).to.deep.equal(updatedTire);
        });

        it('devrait supprimer les champs techniques interdits du payload', async () => {
            const tireId = 'tire123';
            const updateData = {
                brand: 'Goodyear',
                mountedAtKm: 999999,
                mountedOnModel: 'Truck',
                mountedOnEntity: 'truck123',
            };

            const fakeTire = {
                id: tireId,
                brand: 'Michelin',
            };

            const updatedTire = {
                ...fakeTire,
                brand: 'Goodyear',
            };

            tireRepositoryStub.findById.resolves(fakeTire);
            tireRepositoryStub.update.resolves(updatedTire);

            await tireService.update(tireId, updateData);

            const updateCall = tireRepositoryStub.update.getCall(0);
            const sanitizedData = updateCall.args[1];

            expect(sanitizedData).to.have.property('brand', 'Goodyear');
            expect(sanitizedData).to.not.have.property('mountedAtKm');
            expect(sanitizedData).to.not.have.property('mountedOnModel');
            expect(sanitizedData).to.not.have.property('mountedOnEntity');
        });

        it('devrait lancer une erreur 404 si le pneu n\'existe pas', async () => {
            const tireId = 'tire999';
            const updateData = { brand: 'Michelin' };

            tireRepositoryStub.findById.resolves(null);

            try {
                await tireService.update(tireId, updateData);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('Tire not found');
                expect(tireRepositoryStub.update.called).to.be.false;
            }
        });
    });
});

