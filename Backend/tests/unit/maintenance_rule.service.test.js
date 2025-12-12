const { expect } = require('chai');
const sinon = require('sinon');

const MaintenanceRuleService = require('../../app/Services/MaintenanceRuleService');

describe('MaintenanceRuleService', () => {
    let repo;
    let service;

    beforeEach(() => {
        repo = {
            model: {
                find: sinon.stub(),
            },
            create: sinon.stub(),
            findById: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub(),
        };

        service = new MaintenanceRuleService(repo);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('create', () => {
        it('devrait créer une règle Truck avec periodKm', async () => {
            const payload = { targetEntityType: 'Truck', periodKm: 10000, name: 'R1' };
            const created = { ...payload, _id: 'id1' };
            repo.create.resolves(created);

            const result = await service.create(payload);

            expect(repo.create.calledOnceWith(payload)).to.be.true;
            expect(result).to.equal(created);
        });

        it('devrait créer une règle Trailer avec periodMonths', async () => {
            const payload = { targetEntityType: 'Trailer', periodMonths: 6, name: 'R2' };
            const created = { ...payload, _id: 'id2' };
            repo.create.resolves(created);

            const result = await service.create(payload);

            expect(repo.create.calledOnceWith(payload)).to.be.true;
            expect(result).to.equal(created);
        });

        it('devrait créer une règle Truck avec periodKm et periodMonths', async () => {
            const payload = { targetEntityType: 'Truck', periodKm: 15000, periodMonths: 12, name: 'R3' };
            const created = { ...payload, _id: 'id3' };
            repo.create.resolves(created);

            const result = await service.create(payload);

            expect(repo.create.calledOnceWith(payload)).to.be.true;
            expect(result).to.equal(created);
        });

        it('devrait échouer si Trailer possède periodKm (validation)', async () => {
            const payload = { targetEntityType: 'Trailer', periodKm: 10000, name: 'BadTrailer' };
            const validationError = new Error('Trailer maintenance rule cannot have periodKm');
            validationError.name = 'ValidationError';
            validationError.status = 400;
            repo.create.rejects(validationError);

            try {
                await service.create(payload);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.equal(validationError);
                expect(error.name).to.equal('ValidationError');
            }
        });

        it('devrait échouer si Trailer sans periodMonths (validation)', async () => {
            const payload = { targetEntityType: 'Trailer', name: 'NoMonths' };
            const validationError = new Error('Trailer maintenance rule must have periodMonths');
            validationError.name = 'ValidationError';
            validationError.status = 400;
            repo.create.rejects(validationError);

            try {
                await service.create(payload);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.equal(validationError);
                expect(error.name).to.equal('ValidationError');
            }
        });

        it('devrait échouer si aucune période n’est fournie (validation)', async () => {
            const payload = { targetEntityType: 'Truck', name: 'Empty' };
            const validationError = new Error('Maintenance rule must have at least periodKm or periodMonths.');
            validationError.name = 'ValidationError';
            validationError.status = 400;
            repo.create.rejects(validationError);

            try {
                await service.create(payload);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.equal(validationError);
                expect(error.name).to.equal('ValidationError');
            }
        });
    });

    describe('getAll', () => {
        it('devrait retourner la liste des règles', async () => {
            const rules = [{ id: '1' }, { id: '2' }];
            repo.model.find.resolves(rules);

            const result = await service.getAll();

            expect(repo.model.find.calledOnceWith({})).to.be.true;
            expect(result).to.equal(rules);
        });
    });

    describe('delete', () => {
        it('devrait supprimer une règle existante', async () => {
            const id = 'rule1';
            const existing = { id };
            repo.findById.resolves(existing);
            repo.delete.resolves(existing);

            const result = await service.delete(id);

            expect(repo.findById.calledOnceWith(id)).to.be.true;
            expect(repo.delete.calledOnceWith(id)).to.be.true;
            expect(result).to.equal(existing);
        });

        it('devrait lancer 404 si la règle n’existe pas', async () => {
            const id = 'missing';
            repo.findById.resolves(null);

            try {
                await service.delete(id);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(404);
                expect(error.message).to.include('not found');
                expect(repo.delete.called).to.be.false;
            }
        });
    });
});

